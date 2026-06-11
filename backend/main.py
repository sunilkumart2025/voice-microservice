from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS so your React local app can communicate safely
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "healthy", "message": "Backend engine is running smoothly!"}

@app.post("/v1/stt")
async def basic_stt_endpoint(file: UploadFile = File(...)):
    # This reads the incoming file metadata cleanly
    print(f"Received file: {file.filename}, Content-Type: {file.content_type}")
    
    # Return a basic placeholder configuration to prove the pipeline works
    return {
        "text": "Hello, this is a working mock transcription from the local backend!",
        "language": "en",
        "segments": [
            {"start": 0.0, "end": 2.0, "text": "Hello, this is a working mock"}
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)