import sys
print("Step 1: Python environment is alive.")

try:
    from faster_whisper import WhisperModel
    print("Step 2: Faster-Whisper imported successfully.")
except Exception as e:
    print(f"Failed at Step 2: {e}")
    sys.exit(1)

print("Step 3: Attempting to download/load the model weights...")
try:
    # Testing with 'tiny' first because it downloads in seconds and isolates the crash
    model = WhisperModel("tiny", device="cpu", compute_type="int8")
    print("🎉 SUCCESS! The model loaded perfectly without crashing.")
except Exception as e:
    print(f"💥 CRASHED at Step 3: {e}")