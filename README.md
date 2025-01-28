# TestBench 📚

TestBench is a comprehensive online assessment platform that enables teachers to create, manage, and evaluate tests using AI-powered grading through Google's Gemini API. Students can easily attempt tests and receive instant feedback on their performance.

## ✨ Features

### For Teachers
- 👨‍🏫 Create custom tests with multiple questions
- 🤖 AI-powered automatic evaluation using Gemini API
- 📊 View detailed submission analytics
- ✏️ Edit and update test content
- 🔄 Activate/deactivate tests as needed
- 📝 Review individual student submissions

### For Students
- 📝 Take tests with a user-friendly interface
- ⏱️ Real-time test submission
- 📈 View scores immediately after submission
- 📱 Mobile-responsive design
- 🔍 Access test history

## 🛠️ Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Express-session
- **AI Integration**: Google Gemini API
- **Security**: Crypto for password hashing

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Google Gemini API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/testbench.git
cd testbench
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory
```env
PORT=5002
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
SESSION_SECRET=your_session_secret
```

4. Start the server
```bash
npm start
```

The application will be available at `http://localhost:5002`

## 💡 Usage

### Teacher Flow
1. Sign up/Login as a teacher
2. Create a new test from the dashboard
3. Add questions to the test
4. Activate the test when ready
5. View and evaluate submissions

### Student Flow
1. Sign up/Login as a student
2. View available active tests
3. Attempt tests
4. Submit answers
5. View scores and feedback

## 🔐 Security Features

- Password hashing using crypto
- Session-based authentication
- Protected routes
- Secure cookie configuration
- Input validation and sanitization

## 📁 Project Structure

```
TestBench/
├── models/
│   └── models.js
├── public/
│   ├── css/
│   ├── js/
│   ├── html/
│   │   ├── aiTest.html
│   │   ├── createtest.html
│   │   ├── login.html
│   │   ├── navbar.html
│   │   └── signup.html
├── views/
│   ├── teacherDashboard.ejs
│   ├── studentDashboard.ejs
│   ├── test.ejs
│   ├── scores.ejs
│   └── edittest.ejs
├── server.js
├── package.json
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⭐ Support

If you found this project helpful, please give it a ⭐️ on GitHub!

## 📧 Contact

Your Name - yuvraj03703@gmail.com
Project Link: https://github.com/yuvraj488/testbench
