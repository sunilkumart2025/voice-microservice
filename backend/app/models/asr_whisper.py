import io
import logging
from faster_whisper import WhisperModel

# Set up clean logging
logger = logging.getLogger("uvicorn.error")

class WhisperModelWrapper:
    def __init__(self):
        self.model = None

    # Change this line inside your WhisperModelWrapper class:
    def load_model(self):
        if self.model is None:
            print("Initializing local faster-whisper model...")
            # Switch "large-v3" to "base" or "tiny" for instant verification
            self.model = WhisperModel("base", device="cpu", compute_type="int8")
            print("Local Whisper Model loaded successfully!")
            print("Initializing local faster-whisper model...", flush=True)
    def transcribe(self, audio_bytes: bytes, language_hint: str = None) -> dict:
        """Runs fast local machine learning inference on the raw file binary."""
        if self.model is None:
            self.load_model()

        # Convert the raw bytes directly into an in-memory file stream
        audio_stream = io.BytesIO(audio_bytes)

        # UPGRADED INFERENCE CONFIGURATION:
        # We turn on VAD and adjust thresholds to kill hallucinations completely
        segments, info = self.model.transcribe(
            audio_stream,
            beam_size=5,
            language=language_hint,
            vad_filter=True,                        # Filters out background room noise and silence
            vad_parameters=dict(min_speech_duration_ms=250), # Ignores short accidental clicks/pops
            no_speech_threshold=0.5,                # Rejects text if silence probability exceeds 50%
            compression_ratio_threshold=2.4,        # Stops the model from repeating gibberish loops
            condition_on_previous_text=False        # Prevents an error in one segment from corrupting the next
        )

        # Process and compile the temporal segment blocks dynamically
        formatted_segments = []
        for segment in segments:
            formatted_segments.append({
                "start": round(segment.start, 2),
                "end": round(segment.end, 2),
                "text": segment.text.strip()
            })

        # CRITICAL RULE: Return the text in its original spoken language
        full_transcript = " ".join([seg["text"] for seg in formatted_segments])

        return {
            "text": full_transcript,
            "language": info.language,
            "segments": formatted_segments
        }
# Global singleton worker instance
whisper_worker = WhisperModelWrapper()