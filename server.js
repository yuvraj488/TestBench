require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const crypto = require("crypto");
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Constants and Configuration
const PORT = process.env.PORT;
const API_KEY = process.env.GEMINI_API_KEY ;
const mongoURI =process.env.MONGO_URI

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Initialize Express App
const app = express();

// Basic middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const BASE_URL = process.env.BASE_URL || '/';
app.use(BASE_URL, express.static(path.join(__dirname, 'public')));

// Session configuration - Fixed secret warning
app.use(session({
    secret: crypto.randomBytes(32).toString('hex'),
    resave: false,
    saveUninitialized: false,

}));

// View Engine Setup
app.set("view engine", "ejs");

// MongoDB Connection - Removed deprecated options
mongoose.connect(mongoURI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => console.error("MongoDB connection error:", err));

// Import Models
const { User, Test, Submission } = require("./models.js");


// Middleware Configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    //cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// View Engine Setup
app.set("view engine", "ejs");

// Utility Functions
function hashPassword(password) {
    return crypto.pbkdf2Sync(password, 'salt_key', 1000, 64, 'sha512').toString('hex');
}

function generateCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array(6).fill(0).map(() => characters[Math.floor(Math.random() * characters.length)]).join('');
}

// Authentication Middleware
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

// Routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
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
            res.render("teacherDashboard", { data: data.length > 0 ? data : [] });
        })
        .catch(err => {
            console.error("Error fetching tests:", err);
            res.status(500).send("Internal Server Error");
        });
});

app.get("/creaTetest", authentication1, (req, res) => {
    res.sendFile(path.join(__dirname, "public", "createTest.html"));
});

app.post("/createTest", (req, res) => {
    const questionsArray = Array.from({ length: parseInt(req.body.numberOfQuestions) }, (_, i) => {
        const question = req.body[`question${i + 1}`];
        return question || null;
    }).filter(q => q !== null);

    const newTest = new Test({
        subject: req.body.subject,
        topic: req.body.topic,
        totalQuestions: questionsArray.length,
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

app.post("/activate/:code", authentication1, async (req, res) => {
    try {
        const updatedTest = await Test.findOneAndUpdate(
            { code: req.params.code },
            { status: "Active" },
            { new: true }
        );

        res.json({
            success: !!updatedTest,
            message: updatedTest ? "Test activated successfully" : "Test not found",
            data: updatedTest
        });
    } catch (err) {
        console.error("Error activating test:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

app.get("/studentDashboard", authentication1, (req, res) => {
    Test.find({ status: "Active" })
        .then(data => {
            res.render("studentDashboard", { data });
        })
        .catch(err => {
            console.error("Error fetching tests:", err);
            res.status(500).send("Internal Server Error");
        });
});

app.get("/test/:code", authentication1, async (req, res) => {
    try {
        const test = await Test.findOne({ code: req.params.code });
        if (!test) {
            return res.status(404).send("Test not found");
        }
        res.render("test", {
            test,
            code: req.params.code,
            questions: test.questions
        });
    } catch (err) {
        console.error("Error fetching test:", err);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/submitTest/:code', async (req, res) => {
    try {
        const test = await Test.findOne({ code: req.params.code });
        if (!test) {
            throw new Error('Test not found');
        }

        const answers = [];
        let totalMarks = 0;

        for (let i = 0; i < test.questions.length; i++) {
            const answer = req.body[`question${i + 1}`];
            if (answer) {
                answers.push(answer);
                try {
                    const prompt = `${test.questions[i]} solution: ${answer} Evaluate this answer and provide a score out of 5. Response format: Single number between 0-5`;
                    const result = await model.generateContent(prompt);
                    const score = parseInt(await result.response.text().trim());
                    if (!isNaN(score)) {
                        totalMarks += score;
                    }
                } catch (evalError) {
                    console.error('Error evaluating answer:', evalError);
                }
            }
        }

        const newSubmission = new Submission({
            email: req.session.email,
            code: req.params.code,
            question: test.questions,
            answer: answers,
            marks: totalMarks.toString()
        });

        await newSubmission.save();
        res.redirect('/studentDashboard');
    } catch (error) {
        console.error('Error processing test submission:', error);
        res.status(500).send('Error submitting test: ' + error.message);
    }
});

app.get('/viewScore/:code', async (req, res) => {
    try {
        const [submissions, testDetails] = await Promise.all([
            Submission.find({ code: req.params.code }),
            Test.findOne({ code: req.params.code })
        ]);

        if (!testDetails) {
            return res.status(404).json({
                success: false,
                message: 'Test not found'
            });
        }

        res.render('scores', {
            submissions: submissions || [],
            test: testDetails,
            success: true,
            message: submissions.length === 0 ? 'No submissions found for this test' : null
        });
    } catch (error) {
        console.error('Error fetching scores:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching scores',
            error: error.message
        });
    }
});

app.get('/edit/:code', async (req, res) => {
    try {
        const test = await Test.findOne({ code: req.params.code });
        if (!test) {
            return res.status(404).render('error', { message: 'Test not found' });
        }
        res.render('edittest', { test });
    } catch (error) {
        console.error('Error fetching test for edit:', error);
        res.status(500).render('error', { message: 'Error fetching test details' });
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
            return res.status(404).render('error', { message: 'Test not found' });
        }

        res.redirect('/teacherDashboard');
    } catch (error) {
        console.error('Error updating test:', error);
        res.status(500).render('error', { message: 'Error updating test' });
    }
});

app.delete('/delete/:code', async (req, res) => {
    try {
        const [deletedTest] = await Promise.all([
            Test.findOneAndDelete({ code: req.params.code }),
            Submission.deleteMany({ testCode: req.params.code })
        ]);

        if (!deletedTest) {
            return res.status(404).json({
                success: false,
                message: 'Test not found'
            });
        }

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

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});