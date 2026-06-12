# 🎤 Voice Microservice – Speech-to-Text Service

A production-ready Speech-to-Text (STT) microservice built with FastAPI and Faster-Whisper Large-v3.

The service accepts audio files from a browser-based recording interface, processes them through a highly optimized speech recognition pipeline, and returns accurate transcripts along with timestamped speech segments.

---

## ✨ Features

* 🎙 Browser Voice Recording
* 🌐 React Frontend Dashboard
* ⚡ FastAPI Backend
* 🧠 Faster-Whisper Large-v3
* 🌍 Automatic Language Detection
* 📝 Timestamped Transcript Segments
* 🚀 GPU Acceleration Support
* 🔒 Fully Local Processing
* 📦 Docker Ready
* 📈 Production Scalable Architecture

---

## 🏗 Architecture

```text
Browser Microphone
        │
        ▼
MediaRecorder API
        │
        ▼
Audio Blob/File
        │
        ▼
POST /v1/stt
        │
        ▼
FastAPI Backend
        │
        ▼
Audio Validation
        │
        ▼
Audio Conversion
        │
        ▼
Faster-Whisper Large-v3
        │
        ▼
Transcript Generation
        │
        ▼
Language Detection
        │
        ▼
Segment Extraction
        │
        ▼
JSON Response
```

---

## 🛠 Technology Stack

| Layer            | Technology              |
| ---------------- | ----------------------- |
| Frontend         | React + Vite            |
| Backend          | FastAPI                 |
| AI Model         | Faster-Whisper Large-v3 |
| Runtime          | Python                  |
| Validation       | Pydantic                |
| Audio Processing | FFmpeg                  |
| Server           | Uvicorn                 |
| Package Manager  | Pip                     |
| Containerization | Docker                  |

---

# 📁 Repository Structure

```text
voice-microservice/
├── backend/
│
│   ├── app/
│   │
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   └── stt.py
│   │   │   │
│   │   │   └── schemas/
│   │   │       └── stt.py
│   │   │
│   │   ├── models/
│   │   │   └── asr_whisper.py
│   │   │
│   │   ├── services/
│   │   │   └── stt_service.py
│   │   │
│   │   ├── core/
│   │   │   ├── audio_utils.py
│   │   │   ├── languages.py
│   │   │   └── logging.py
│   │   │
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── Dockerfile
│
└── frontend/
    ├── src/
    │
    ├── components/
    ├── views/
    ├── App.jsx
    └── index.css
```

---

# 🚀 API Endpoint

## POST /v1/stt

Uploads an audio file and returns:

* Transcript
* Detected Language
* Timestamp Segments

### Request

```bash
curl -X POST \
-F "file=@sample.wav" \
http://localhost:8000/v1/stt
```

### Optional Language Hint

```bash
curl -X POST \
-F "file=@sample.wav" \
-F "language=hi" \
http://localhost:8000/v1/stt
```

---

## Example Response

```json
{
  "text": "Hello everyone welcome to our project",
  "language": "en",
  "segments": [
    {
      "start": 0.0,
      "end": 2.5,
      "text": "Hello everyone"
    },
    {
      "start": 2.5,
      "end": 5.1,
      "text": "welcome to our project"
    }
  ]
}
```

---

# 🎧 Supported Audio Formats

* WAV
* MP3
* WEBM
* M4A

---

# 🔐 Validation Rules

### Accepted MIME Types

```text
audio/wav
audio/x-wav
audio/mpeg
audio/mp3
audio/webm
audio/mp4
```

### Restrictions

```text
Maximum File Size : 25 MB
Minimum File Size : 1 KB
```

### Validation Checks

* Invalid MIME Types
* Corrupted Audio
* Empty Uploads
* Oversized Files
* Model Errors

---

# 🛠 Backend Environment Setup

## 1. Extract the Project

Unzip the project archive anywhere on your system.

Example:

```text
Desktop/
└── voice-microservice/
```

---

## 2. Open Terminal

Navigate into backend folder:

```bash
cd voice-microservice/backend
```

---

## 3. Create Virtual Environment

```bash
python -m venv myenv
```

---

## 4. Activate Environment

### Windows PowerShell

```powershell
.\myenv\Scripts\Activate.ps1
```

### Windows CMD

```cmd
.\myenv\Scripts\activate.bat
```

### Linux / macOS

```bash
source myenv/bin/activate
```

---

## 5. Upgrade Pip Tools

```bash
python -m pip install --upgrade pip setuptools wheel
```

---

## 6. Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 7. Start Backend Server

```bash
uvicorn main:app --reload --port 8000
```

Server:

```text
http://localhost:8000
```

Swagger Documentation:

```text
http://localhost:8000/docs
```

---

# 🎨 Frontend Dashboard Setup

Open a second terminal window.

Navigate to frontend:

```bash
cd voice-microservice/frontend
```

---

## Install Packages

```bash
npm install
```

---

## Start Frontend

```bash
npm run dev
```

---

Frontend URL:

```text
http://localhost:5173
```

Open the dashboard and click the microphone button to begin recording.

---

# 💡 Important Notice

On the first startup, Faster-Whisper automatically downloads the required model weights into the local machine cache.

This download may take a few minutes depending on internet speed.

During this process:

* The terminal may appear idle.
* The server is still working correctly.
* No user audio is sent to external services.
* All processing remains local and private.

---

# 🧠 STT Processing Pipeline

```text
User Voice
      │
      ▼
MediaRecorder
      │
      ▼
Audio Blob
      │
      ▼
File Upload
      │
      ▼
FastAPI Endpoint
      │
      ▼
Audio Validation
      │
      ▼
Audio Conversion
      │
      ▼
Faster-Whisper Large-v3
      │
      ▼
Language Detection
      │
      ▼
Timestamp Segmentation
      │
      ▼
JSON Response
```

---

# 🧪 Testing

Run all tests:

```bash
pytest
```

Run coverage:

```bash
pytest --cov=app
```

---

# 📈 Performance

| Model    | Accuracy | Speed     |
| -------- | -------- | --------- |
| tiny     | Low      | Very Fast |
| base     | Medium   | Fast      |
| medium   | High     | Moderate  |
| large-v3 | Best     | Slower    |

Current Production Model:

```text
faster-whisper-large-v3
```

---

# 🔒 Security

* MIME Validation
* File Size Limits
* Safe Error Responses
* Structured Logging
* Upload Validation
* Request Limiting Ready

---

# 🚀 Future Enhancements

* Streaming Speech Recognition
* Real-time WebSocket STT
* Speaker Diarization
* Voice Activity Detection (VAD)
* Translation Integration
* Voice Agent Integration
* Batch Audio Processing

---

# 📄 License

MIT License

---

# 👥 Team

Voice Microservice Team

Built with ❤️ using FastAPI, React, and Faster-Whisper Large-v3.
