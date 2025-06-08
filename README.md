# 🧠 AI-Powered Meeting Insights

> **Transform meeting recordings into actionable insights using AI. This application uses OpenAI's Whisper for transcription and GPT for analysis to help teams stay organized and productive.**

---

## 🚀 Features

- **Audio Upload:** Upload meeting recordings in WAV format
- **AI-Powered Transcription:** Fast and accurate speech-to-text conversion using OpenAI Whisper
- **Smart Analysis:** Get structured insights including:
  - Executive Summary
  - Key Decisions
  - Action Items
  - Follow-up Points
  - Next Steps
- **Modern UI:** Clean, intuitive interface built with React and Tailwind CSS

---

## 🛠️ Tech Stack

- **Frontend:** 
  - React (Vite)
  - Tailwind CSS
  - Shadcn UI Components
- **Backend:** 
  - Node.js with Express
  - TypeScript
- **AI Services:** 
  - OpenAI Whisper (for transcription)
  - OpenAI GPT (for text analysis)
- **Storage:** Local filesystem for temporary audio storage

---

## ⚙️ How It Works

1. **Upload an audio file** through the web interface
2. **Transcription:** The backend uses OpenAI Whisper to convert speech to text
3. **Analysis:** The transcribed text is processed by OpenAI GPT to generate:
   - Executive Summary
   - Key Decisions
   - Action Items
   - Follow-up Points
   - Next Steps
4. **Results Display:** Insights are displayed in a clean, markdown-formatted interface

---

## 💻 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/ai-powered-meeting-insights.git
   cd ai-powered-meeting-insights
   ```

2. **Install dependencies:**
   ```sh
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Configure environment variables:**
   - Create a `.env` file in the backend directory:
     ```
     OPENAI_API_KEY=your_api_key_here
     PORT=3000
     ```

4. **Start the development servers:**
   ```sh
   # Start backend server (from backend directory)
   npm run dev

   # Start frontend server (from frontend directory)
   npm run dev
   ```

5. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

---

## 📝 API Endpoints

- `POST /api/meetings/testTranscription`
  - Accepts audio file upload
  - Returns transcription and analysis

---

## 🔒 Security

- Audio files are temporarily stored and automatically deleted after processing
- API keys are stored in environment variables
- File uploads are restricted to audio formats

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
