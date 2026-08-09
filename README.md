# 🤖 AI Interview Agent

An AI-powered **Technical Interview Platform** that conducts personalized, multi-turn technical interviews based on a candidate's profile, completed missions, and curriculum progress.

The platform uses **React.js, Node.js, Express.js, MongoDB, and OpenRouter** to dynamically generate interview questions, evaluate candidate answers, track interview sessions, and generate a final AI-powered performance report.

---

## 🌐 Live Deployment

### Frontend

**Vercel:**
`https://your-frontend-url.vercel.app`

### Backend

**Render:**
https://ai-interview-agent-1-de37.onrender.com

---

## 📋 Table of Contents

* [Features](#-features)
* [System Architecture](#-system-architecture)
* [Technologies Used](#-technologies-used)
* [Project Structure](#-project-structure)
* [How It Works](#-how-it-works)
* [Setup Instructions](#️-setup-instructions)
* [Environment Variables](#-environment-variables)
* [API](#-api)
* [AI Evaluation System](#-ai-evaluation-system)
* [Deployment](#-deployment)
* [Future Scope](#-future-scope)
* [Key Highlights](#-key-highlights)

---

## ✨ Features

### 🎯 Personalized Technical Interviews

* Candidate-specific interview sessions
* AI-generated technical questions
* Questions based on candidate profile and curriculum progress
* Multi-turn interview conversations
* Automatic session ID generation
* Interview progress tracking
* Curriculum-aware question selection

### 🧠 AI-Powered Answer Evaluation

After every candidate answer, the AI evaluates:

* Technical correctness
* Relevance
* Completeness
* Depth
* Clarity
* Practical understanding
* Missing concepts

Each answer receives:

* Score out of 10
* Detailed feedback
* Correct points
* Missing points
* Improvement suggestions

### 📊 Final Interview Report

After completing the interview, the system generates a final AI-powered report containing:

* Overall score
* Performance summary
* Strengths
* Weaknesses
* Knowledge gaps
* Recommended next steps

### 💬 Interactive Interview Interface

* Chat-style interview interface
* Candidate and interviewer message separation
* Loading states
* Error handling
* Automatic scrolling
* Interview timer
* Question progress indicator
* Light/Dark mode

### 🗂️ Persistent Interview Sessions

Interview sessions are stored in MongoDB, including:

* Candidate information
* Session ID
* Questions asked
* Conversation history
* Curriculum days covered
* Current question
* Answer evaluations
* Final feedback
* Completion status

---

## 🏗️ System Architecture

```text
                         ┌─────────────────────┐
                         │      React.js       │
                         │      Frontend       │
                         │   Vite + Tailwind   │
                         └──────────┬──────────┘
                                    │
                                  Axios
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │     Express.js      │
                         │       Backend       │
                         └──────────┬──────────┘
                                    │
                    ┌───────────────┴────────────────┐
                    │                                │
                    ▼                                ▼
          ┌──────────────────┐             ┌──────────────────┐
          │     MongoDB      │             │    OpenRouter    │
          │    + Mongoose    │             │       LLM        │
          └──────────────────┘             └──────────────────┘
                    │                                │
                    └───────────────┬────────────────┘
                                    ▼
                         ┌─────────────────────┐
                         │ Interview Evaluation│
                         │ & Question Engine   │
                         └─────────────────────┘
```

---

## 🛠️ Technologies Used

### Frontend

| Technology       | Purpose             |
| ---------------- | ------------------- |
| React.js         | Frontend framework  |
| Vite             | Build tool          |
| Tailwind CSS     | Styling             |
| React Router DOM | Client-side routing |
| Axios            | API communication   |
| Lucide React     | UI icons            |

### Backend

| Technology    | Purpose                   |
| ------------- | ------------------------- |
| Node.js       | Runtime environment       |
| Express.js    | Backend framework         |
| MongoDB       | Database                  |
| Mongoose      | MongoDB ODM               |
| OpenAI SDK    | LLM API client            |
| OpenRouter    | AI model gateway          |
| CORS          | Cross-origin requests     |
| Cookie Parser | Cookie handling           |
| Dotenv        | Environment configuration |

---

## 📁 Project Structure

```text
AI-Interview-Agent/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── interview.controller.js
│   │   │
│   │   ├── data/
│   │   │   ├── candidates.json
│   │   │   └── curriculum.json
│   │   │
│   │   ├── db/
│   │   │   └── index.js
│   │   │
│   │   ├── models/
│   │   │   └── InterviewSession.model.js
│   │   │
│   │   ├── routes/
│   │   │   └── interview.routes.js
│   │   │
│   │   ├── services/
│   │   │   ├── ai.service.js
│   │   │   ├── feedback.service.js
│   │   │   ├── interview.service.js
│   │   │   └── gemini.service.js
│   │   │
│   │   ├── utils/
│   │   │   ├── ApiError.js
│   │   │   ├── ApiResponse.js
│   │   │   └── asyncHandler.js
│   │   │
│   │   ├── app.js
│   │   └── index.js
│   │
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Candidate.jsx
│   │   │   ├── Interview.jsx
│   │   │   └── Result.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# 🔄 How It Works

## 1. Candidate Selection

The candidate selects a profile from the frontend.

Candidate information contains data such as:

```json
{
  "member": {},
  "missions": [],
  "signals": {}
}
```

The backend uses this information to build a personalized interview context.

---

## 2. Start Interview

The frontend sends the candidate data to the interview API.

```http
POST /api/interview
```

The backend:

1. Creates a unique interview session.
2. Builds candidate context.
3. Determines relevant curriculum.
4. Generates the first AI question.
5. Stores the session in MongoDB.
6. Returns the first question.

Example response:

```json
{
  "statusCode": 200,
  "data": {
    "sessionId": "...",
    "reply": "Explain how a RAG pipeline works...",
    "done": false
  },
  "message": "Interview started successfully",
  "success": true
}
```

---

## 3. Candidate Answers

The candidate submits an answer using the same API.

```http
POST /api/interview
```

Request:

```json
{
  "sessionId": "your-session-id",
  "message": "Candidate's answer"
}
```

---

## 4. AI Evaluation

The backend sends the current question and candidate answer to the AI evaluator.

The AI evaluates:

```text
Technical Correctness
Relevance
Completeness
Depth
Clarity
Practical Understanding
Missing Concepts
```

Example:

```json
{
  "score": 7.5,
  "feedback": "Good answer but some details are missing.",
  "correctPoints": [
    "Correctly explained the core concept."
  ],
  "missingPoints": [
    "Did not discuss implementation details."
  ],
  "improvement": "Explain the implementation and trade-offs in more detail."
}
```

---

## 5. Next Question Generation

After evaluation, the backend updates the conversation history and generates the next question based on:

* Candidate profile
* Curriculum
* Previous questions
* Previous answers
* Covered curriculum days

Response:

```json
{
  "statusCode": 200,
  "data": {
    "sessionId": "...",
    "evaluation": {},
    "reply": "Next interview question...",
    "done": false
  },
  "message": "Answer evaluated and next question generated",
  "success": true
}
```

---

## 6. Interview Completion

After the required number of questions are completed, the backend generates the final interview report.

Example:

```json
{
  "overallScore": 82,
  "summary": "The candidate demonstrated strong technical understanding...",
  "strengths": [
    "Strong understanding of RAG systems"
  ],
  "weaknesses": [
    "Needs more depth in production implementation"
  ],
  "gaps": [
    "Advanced evaluation techniques"
  ],
  "next": [
    "Practice production-level RAG architectures"
  ]
}
```

---

# ⚙️ Setup Instructions

## Backend

Clone the repository:

```bash
git clone https://github.com/rkumardubey17-maker/AI-Interview-Agent.git
```

Go to the project:

```bash
cd AI-Interview-Agent
```

Go to backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
OPENROUTER_API_KEY=your_openrouter_api_key
```

Start the development server:

```bash
npm run dev
```

For production:

```bash
npm start
```

---

## Frontend

Open another terminal:

```bash
cd AI-Interview-Agent/frontend
```

Install dependencies:

```bash
npm install
```

Create `.env`:

```env
VITE_BACKEND_URL=http://localhost:8000
```

Start the development server:

```bash
npm run dev
```

---

# 🔐 Environment Variables

## Backend

| Variable             | Description               |
| -------------------- | ------------------------- |
| `PORT`               | Backend server port       |
| `MONGODB_URI`        | MongoDB connection string |
| `OPENROUTER_API_KEY` | OpenRouter API key        |

## Frontend

| Variable           | Description          |
| ------------------ | -------------------- |
| `VITE_BACKEND_URL` | Backend API base URL |

> ⚠️ Never commit `.env` files or API keys to GitHub.

---

# 🔌 API

## Interview Endpoint

```http
POST /api/interview
```

### Start Interview

```json
{
  "candidate": {
    "member": {},
    "missions": [],
    "signals": {}
  }
}
```

### Continue Interview

```json
{
  "sessionId": "your-session-id",
  "message": "Candidate's answer"
}
```

### Successful Response

```json
{
  "statusCode": 200,
  "data": {
    "sessionId": "...",
    "evaluation": {},
    "reply": "Next question...",
    "done": false
  },
  "message": "Answer evaluated and next question generated",
  "success": true
}
```

---

# 🧠 AI Integration

The project uses **OpenRouter** as the AI gateway through the OpenAI SDK.

The backend provides the AI with:

* Candidate information
* Curriculum information
* Conversation history
* Current question
* Candidate answer
* Covered curriculum days

The AI is responsible for:

### Question Generation

Generating relevant technical interview questions based on the candidate's context.

### Answer Evaluation

Evaluating candidate answers and providing structured feedback.

### Final Evaluation

Generating a complete interview performance report.

---

# 📊 AI Evaluation System

Each answer is evaluated on a **0–10 scale**.

The evaluator considers:

* Technical correctness
* Relevance
* Completeness
* Depth
* Clarity
* Practical understanding
* Missing concepts

The candidate receives actionable feedback instead of only a numerical score.

The final interview report provides a **0–100 overall score**.

---

# 🚀 Deployment

## Backend — Render

The backend is deployed using Render.

### Production Backend

**URL:**
https://ai-interview-agent-1-de37.onrender.com

### Render Configuration

```text
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

Required environment variables:

```env
MONGODB_URI=...
OPENROUTER_API_KEY=...
```

---

## Frontend — Vercel

The frontend is deployed using Vercel.

### Vercel Configuration

```text
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

Environment variable:

```env
VITE_BACKEND_URL=https://ai-interview-agent-1-de37.onrender.com
```

After deployment, make sure the Vercel frontend URL is included in the backend CORS configuration.

---

# 🛡️ Error Handling

The backend includes handling for:

* Invalid API requests
* Missing candidate information
* Missing interview session
* Invalid candidate answers
* Invalid AI responses
* AI JSON parsing errors
* OpenRouter connection failures
* Temporary AI request failures
* MongoDB connection errors
* Completed interview sessions

The OpenRouter service also includes retry handling for temporary request failures.

---

# 📈 Project Highlights

* 🤖 AI-powered technical interviews
* 🎯 Personalized question generation
* 📚 Curriculum-aware interviews
* 🧠 AI answer evaluation
* 📊 Detailed performance reports
* 💾 MongoDB-backed interview sessions
* 🔄 Multi-turn conversations
* 🌐 REST API architecture
* ⚡ React + Vite frontend
* 🛠️ Node.js + Express backend
* 🌙 Light/Dark mode
* ☁️ Vercel + Render deployment
* 🔐 Environment-based secret management

---

# 🔮 Future Scope

### 🎙️ Voice Interview

Planned voice-based interview pipeline:

```text
Microphone
    ↓
Speech-to-Text
    ↓
Interview API
    ↓
LLM Question / Evaluation
    ↓
Text-to-Speech
    ↓
Audio Response
```

### Other Planned Improvements

* 🎙️ Real-time voice interviews
* 🗣️ Speech-to-text integration
* 🔊 Text-to-speech responses
* 📊 Advanced candidate analytics
* 📈 Performance dashboards
* ⚡ Streaming AI responses
* 🧪 Automated evaluation benchmarks
* 🛡️ Advanced AI safety guardrails
* 📚 Expanded technical curriculum
* 👥 Multi-interviewer support

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/your-feature
```

3. Commit your changes.

```bash
git commit -m "feat: add your feature"
```

4. Push the branch.

```bash
git push origin feature/your-feature
```

5. Open a Pull Request.

---

# 📄 License

This project is intended for educational and development purposes.

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

**Built with React, Node.js, MongoDB, and AI.**
