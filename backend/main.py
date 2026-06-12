from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.models.asr_whisper import whisper_worker
import typing
from fastapi.middleware.cors import CORSMiddleware
# Lifecycle management for pre-warming model variables
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Warmup path: Load weights immediately on launch
    whisper_worker.load_model()
    yield

app = FastAPI(lifespan=lifespan)

# Establish strict CORS rule permissions so your React dashboard can talk to it safely
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://voice-microservice.vercel.app"
    ],
    # This regex dynamically matches all vercel.app preview subdomains for your project
    allow_origin_regex=r"https://voice-microservice-.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Enforce strict file size limits to protect local hardware VRAM/RAM (25MB standard cap)
MAX_FILE_SIZE = 25 * 1024 * 1024  
ALLOWED_MIME_TYPES = ["audio/wav", "audio/mpeg", "audio/mp3", "audio/webm", "audio/x-wav"]

@app.post("/v1/stt")
async def speech_to_text(
    file: UploadFile = File(...),
    language: typing.Optional[str] = Form(None)
):
    # Guardrail 1: MIME-Type safety validation filter
    if file.content_type not in ALLOWED_MIME_TYPES and not file.filename.lower().endswith(('.wav', '.mp3', '.webm')):
        raise HTTPException(status_code=400, detail="Unsupported audio format profile.")

    # Guardrail 2: Read payload stream metadata safely up to limit boundaries
    file_bytes = await file.read()
    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="Uploaded file payload exceeds the strict 25MB limit.")
    if len(file_bytes) < 1024:
        raise HTTPException(status_code=400, detail="Audio file empty or corrupted.")

    try:
        # Offload the stream computation package straight to our Whisper singleton worker
        result = whisper_worker.transcribe(file_bytes, language_hint=language)
        return result
    except Exception as e:
        # Mask messy deep-stack python trace lines behind a clean 500 error envelope
        raise HTTPException(status_code=500, detail=f"AI Inference Engine Error: {str(e)}")