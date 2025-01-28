const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const crypto = require("crypto");

const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'png')));

const PORT = 5001;
app.set("view engine", "ejs");

const { User, Test, Submission } = require("./models.js");

mongoose.connect("mongodb+srv://yuvraj_3777:rajput123@cluster0.rxcf8q4.mongodb.net/TestBench?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

function hashPassword(password) {
    return crypto.pbkdf2Sync(password, 'salt_key', 1000, 64, 'sha512').toString('hex');
}


const { GoogleGenerativeAI } = require('@google/generative-ai');
const API_KEY = "AIzaSyAkir_BQXIV5eOSuOr2dOi9yCyoTM2ywBY";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function authentication(req, res, next) {
    if (req.session.logedin) {
        req.session.detail.role === "teacher"
            ? res.redirect("/teacherDashboard")
            : res.redirect("/studentDashboard");
    } else {
        next();
    }
}

function authentication1(req, res, next) {
    if (req.session.logedin) {
        next();
    } else {
        res.redirect("/login");
    }
}

app.get("/", authentication, (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});
app.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log("Error destroying session:", err);
            return res.redirect("/home");
        }
        res.redirect("/login");
    });
});
app.get("/login", authentication, (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});
app.get("/signup", authentication, (req, res) => {
    res.sendFile(path.join(__dirname, "public", "signup.html"));
});

app.post("/login", async (req, res) => {
    try {
        const hashedPassword = hashPassword(req.body.password);
        const user = await User.findOne({
            email: req.body.email,
            password: hashedPassword
        });

        if (user) {
            req.session.logedin = true;
            req.session.detail = user;
            req.session.email = user.email;

            user.role === "teacher"
                ? res.redirect("/teacherDashboard")
                : res.redirect("/studentDashboard");
        } else {
            res.redirect("/signup");
        }
    } catch (err) {
        console.error("Login error:", err);
        res.redirect("/signup");
    }
});

app.post("/signup", async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
            res.redirect("/login");
        } else {
            const hashedPassword = hashPassword(req.body.password);
            const newUser = new User({
                email: req.body.email,
                password: hashedPassword,
                role: req.body.role,
            });

            await newUser.save();
            res.redirect("/login");
        }
    } catch (err) {
        console.error("Signup error:", err);
        res.send("Something went wrong during signup");
    }
});

app.get("/teacherDashboard", authentication1, (req, res) => {
    Test.find({ teacher: req.session.detail.name })
        .then(data => {
            if (data.length > 0) {
                res.render("teacherDashboard", { data });
            } else {
                res.render("teacherDashboard", { data: [] });
            }
        })
        .catch(err => {
            console.error("Error fetching tests:", err);
            res.status(500).send("Internal Server Error");
        });
});

app.get("/creaTetest", authentication1, (req, res) => {
    res.sendFile(path.join(__dirname, "public", "createTest.html"));
})

function generateCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
    }
    return code;
}

app.post("/createTest", (req, res) => {
    const questionsArray = [];
    const numberOfQuestions = parseInt(req.body.numberOfQuestions);

    for (let i = 1; i <= numberOfQuestions; i++) {
        const question = req.body[`question${i}`];
        if (question) {
            questionsArray.push(question);
        }
    }

    const newTest = new Test({
        subject: req.body.subject,
        topic: req.body.topic,
        totalQuestions: numberOfQuestions,
        questions: questionsArray,
        teacher: req.session.username,
        code: generateCode(),
        status: "Inactive"
    });

    newTest.save()
        .then(() => res.redirect("/teacherDashboard"))
        .catch(err => {
            console.error("Error creating test:", err);
            res.send("Error creating test");
        });
});

app.post("/activate/:code", authentication1, (req, res) => {
    const { code } = req.params;

    Test.findOneAndUpdate(
        { code },
        { status: "Active" },
        { new: true }
    )
        .then(updatedTest => {
            if (updatedTest) {
                res.json({ success: true, message: "Test activated successfully", data: updatedTest });
            } else {
                res.json({ success: false, message: "Test not found" });
            }
        })
        .catch(err => {
            console.error("Error activating test:", err);
            res.status(500).json({ success: false, message: "Internal Server Error" });
        });
});

app.get("/studentDashboard", authentication1, (req, res) => {
    Test.find({}).then(data => {
        let filteredData = data.filter(e => e.status === "Active");
        if (filteredData.length > 0) {
            res.render("studentDashboard", { data: filteredData });
        } else {
            res.render("studentDashboard", { data: [] });
        }
    }).catch(err => {
        console.error("Error fetching tests:", err);
        res.status(500).send("Internal Server Error");
    });
});

app.get("/test/:code", authentication1, (req, res) => {
    const testCode = req.params.code;

    Test.findOne({ code: testCode }).then(test => {
        if (!test) {
            return res.status(404).send("Test not found");
        }

        res.render("test", {
            test: test,
            code: testCode,
            questions: test.questions
        });
    }).catch(err => {
        console.error("Error fetching test:", err);
        res.status(500).send("Internal Server Error");
    });
});

app.post('/submitTest/:code', async (req, res) => {
    try {
        const testCode = req.params.code;
        const userEmail = req.session.email;

        const test = await Test.findOne({ code: testCode });
        if (!test) {
            throw new Error('Test not found');
        }

        let questions = test.questions;
        let answers = [];
        let totalMarks = 0;

        for (let i = 0; i < questions.length; i++) {
            const answerKey = `question${i + 1}`;
            const answer = req.body[answerKey];

            if (answer) {
                answers.push(answer);

                try {
                    const prompt = `${questions[i]} solution: ${answer} Evaluate this answer and provide a score out of 5. Response format: Single number between 0-5`;
                    const result = await model.generateContent(prompt);
                    const scoreText = await result.response.text();
                    const score = parseInt(scoreText.trim());

                    if (!isNaN(score)) {
                        totalMarks += score;
                    }
                } catch (evalError) {
                    console.error('Error evaluating answer:', evalError);
                }
            }
        }

        console.log('Saving submission with data:', {
            email: userEmail,
            code: testCode,
            questions: questions,
            answers: answers,
            marks: totalMarks.toString()
        });

        const newSubmission = new Submission({
            email: userEmail,
            code: testCode,
            question: questions,
            answer: answers,
            marks: totalMarks.toString()
        });

        const savedSubmission = await newSubmission.save();
        console.log('Saved submission:', savedSubmission);

        res.redirect('/studentDashboard');
    } catch (error) {
        console.error('Error processing test submission:', error);
        res.status(500).send('Error submitting test: ' + error.message);
    }
});

app.get('/viewScore/:code', async (req, res) => {
    try {
        const submissions = await Submission.find({ code: req.params.code });

        if (!submissions || submissions.length === 0) {
            return res.render('scores', {
                submissions: [],
                message: 'No submissions found for this test',
            });
        }

        const testDetails = await Test.findOne({ code: req.params.code });

        if (!testDetails) {
            return res.status(404).json({
                success: false,
                message: 'Test not found',
            });
        }

        res.render('scores', {
            submissions: submissions,
            test: testDetails,
            success: true,
        });
    } catch (error) {
        console.error('Error fetching scores:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching scores',
            error: error.message,
        });
    }
});

app.get('/edit/:code', async (req, res) => {
    try {
        const test = await Test.findOne({ code: req.params.code });

        if (!test) {
            return res.status(404).render('error', {
                message: 'Test not found'
            });
        }

        res.render('edittest', { test });

    } catch (error) {
        console.error('Error fetching test for edit:', error);
        res.status(500).render('error', {
            message: 'Error fetching test details'
        });
    }
});

app.post('/edit/:code', async (req, res) => {
    try {
        const updatedTest = await Test.findOneAndUpdate(
            { code: req.params.code },
            {
                $set: {
                    subject: req.body.subject,
                    topic: req.body.topic,
                    totalQuestions: req.body.questions.length,
                    questions: req.body.questions,
                    teacher: req.session.email,
                    status: req.body.status
                }
            },
            { new: true }
        );

        if (!updatedTest) {
            return res.status(404).render('error', {
                message: 'Test not found'
            });
        }

        res.redirect('/teacherDashboard');

    } catch (error) {
        console.error('Error updating test:', error);
        res.status(500).render('error', {
            message: 'Error updating test'
        });
    }
});

app.delete('/delete/:code', async (req, res) => {
    try {
        const deletedTest = await Test.findOneAndDelete({ code: req.params.code });

        if (!deletedTest) {
            return res.status(404).json({
                success: false,
                message: 'Test not found'
            });
        }

        await Submission.deleteMany({ testCode: req.params.code });

        res.json({
            success: true,
            message: 'Test and associated submissions deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting test:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting test',
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
