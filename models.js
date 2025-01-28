const mongoose=require("mongoose");
const user=mongoose.Schema({
    name:String,
    email:String,
    password:String,
    role:String
})
const Test = mongoose.Schema({
    subject: String,
    topic: String,
    totalQuestions: Number,
    questions: [String],
    teacher: String,
    code: String,
    status: String,
}, {
    timestamps: true // This will automatically add `createdAt` and `updatedAt` fields
});
const submissionSchema=mongoose.Schema({
    email: String,
    code: String,
    question: [String],
    answer: [String],
    marks:String
});
module.exports={
    User:mongoose.model("users",user),
    Test:mongoose.model("Test",Test),
    Submission:mongoose.model("submissions",submissionSchema)
}