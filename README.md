<h1 align="center">TestBench 🚀</h1>

<p align="center">
  <img src="https://img.shields.io/badge/nodejs-%23339933.svg?style=for-the-badge&logo=node.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=white"/>
  <img src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white"/>
  <img src="https://img.shields.io/badge/Google_Gemini-%234285F4.svg?style=for-the-badge&logo=google&logoColor=white"/>
</p>

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1000&color=2196F3&center=true&width=435&lines=AI-Powered+Assessment+Platform;Create+and+Grade+Tests+Instantly;Comprehensive+Analytics;Real-time+Feedback" alt="Typing SVG" />
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#contributing">Contributing</a>
</p>

<div align="center">

![GitHub repo size](https://img.shields.io/github/repo-size/yuvraj488/testbench)
![GitHub stars](https://img.shields.io/github/stars/yuvraj488/testbench)
![GitHub forks](https://img.shields.io/github/forks/yuvraj488/testbench)
![GitHub issues](https://img.shields.io/github/issues/yuvraj488/testbench)
![GitHub license](https://img.shields.io/github/license/yuvraj488/testbench)

</div>

## ✨ Features

<table>
  <tr>
    <td>
      <h3>For Teachers 👨‍🏫</h3>
      <ul>
        <li>🎯 Create custom tests</li>
        <li>🤖 AI-powered grading</li>
        <li>📊 Detailed analytics</li>
        <li>✏️ Easy test management</li>
      </ul>
    </td>
    <td>
      <h3>For Students 👨‍🎓</h3>
      <ul>
        <li>📝 User-friendly interface</li>
        <li>⚡ Real-time submissions</li>
        <li>📈 Instant feedback</li>
        <li>📱 Mobile responsive</li>
      </ul>
    </td>
  </tr>
</table>

## 🛠️ Tech Stack

<div align="center">

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)

</div>

## 🚀 Getting Started

### Prerequisites

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-v14_or_higher-green?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Required-green?style=for-the-badge&logo=mongodb)
![API Key](https://img.shields.io/badge/Gemini_API_Key-Required-blue?style=for-the-badge&logo=google)

</div>

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
<div align="center">
  <table>
    <tr>
      <td>1️⃣ Sign up/Login as a teacher</td>
      <td>2️⃣ Create a new test from the dashboard</td>
      <td>3️⃣ Add questions to the test</td>
    </tr>
    <tr>
      <td>4️⃣ Activate the test when ready</td>
      <td>5️⃣ View and evaluate submissions</td>
      <td>6️⃣ Monitor student progress</td>
    </tr>
  </table>
</div>

### Student Flow
<div align="center">
  <table>
    <tr>
      <td>1️⃣ Sign up/Login as a student</td>
      <td>2️⃣ View available active tests</td>
      <td>3️⃣ Attempt tests</td>
    </tr>
    <tr>
      <td>4️⃣ Submit answers</td>
      <td>5️⃣ View scores and feedback</td>
      <td>6️⃣ Track performance</td>
    </tr>
  </table>
</div>

## 🔐 Security Features

<div align="center">

![Password Hashing](https://img.shields.io/badge/Password_Hashing-Crypto-red?style=for-the-badge)
![Authentication](https://img.shields.io/badge/Authentication-Session_Based-blue?style=for-the-badge)
![Routes](https://img.shields.io/badge/Routes-Protected-green?style=for-the-badge)
![Cookies](https://img.shields.io/badge/Cookies-Secure-yellow?style=for-the-badge)
![Input](https://img.shields.io/badge/Input-Validated_&_Sanitized-purple?style=for-the-badge)

</div>

## 🗂️ Project Structure

```bash
TestBench/
├── 📁 models/
│   └── 📄 models.js
├── 📁 public/
│   ├── 📁 css/
│   ├── 📁 js/
│   └── 📁 html/
│       ├── 📄 aiTest.html
│       ├── 📄 createtest.html
│       ├── 📄 login.html
│       ├── 📄 navbar.html
│       └── 📄 signup.html
├── 📁 views/
│   ├── 📄 teacherDashboard.ejs
│   ├── 📄 studentDashboard.ejs
│   ├── 📄 test.ejs
│   ├── 📄 scores.ejs
│   └── 📄 edittest.ejs
├── 📄 server.js
├── 📄 package.json
└── 📄 README.md
```

## 📈 Stats

<div align="center">
  <img src="https://github-readme-stats.vercel.app/api/pin/?username=yuvraj488&repo=testbench&theme=react&show_description=true&show_owner=true&description_lines=3" alt="Repo Card" />
</div>

## 🤝 Contributing

<img src="https://contrib.rocks/image?repo=yuvraj488/testbench" />

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

## 📈 Activity

![Activity Graph](https://activity-graph.herokuapp.com/graph?username=yuvraj488&theme=react-dark)

## 📝 License

Released under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  <img src="https://profile-counter.glitch.me/yuvraj488/count.svg" alt="Visitor Count" />
</p>

<p align="center">
  If you like this project, please consider giving it a ⭐
</p>
