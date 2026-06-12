import React, { useState, useRef } from 'react';
import { Mic, Square, AlertTriangle, FileAudio, RefreshCw, Loader2, Languages } from 'lucide-react';

export default function App() {
  // Core application tracking states
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState(null);

  // References to keep browser media interfaces alive across render passes
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // 1. Web Audio API Connection: Capture voice frequency waves directly from the hardware microphone
  const startRecording = async () => {
    audioChunksRef.current = [];
    setMicPermissionDenied(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        // Compile the raw voice chunks directly into a standard webm audio file structure
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        
        // Immediately cut the hardware track to turn off the physical mic recording light
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Hardware permission request blocked:", err);
      setMicPermissionDenied(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // 2. Network Dispatch API Hook: Send the raw compiled file binary directly to your FastAPI container
  const uploadAudioToBackend = async () => {
    if (!audioBlob) return;
    setIsUploading(true);

    const formData = new FormData();
    // Append the file payload matching our backend multipart contract expectations
    formData.append('file', audioBlob, 'user_voice_capture.webm');

    try {
      const response = await fetch('https://voice-stt-backend.onrender.com/v1/stt', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Inference network routine communication crash.');
      }
      
      const data = await response.json();
      setTranscriptionResult(data); // Safely sets: { text, language, segments }
    } catch (error) {
      alert(`System connection error: ${error.message}. Make sure your Python server is running on port 8000!`);
    } finally {
      setIsUploading(false);
    }
  };

  const clearWorkspace = () => {
    setAudioBlob(null);
    setTranscriptionResult(null);
  };

  return (
    <div className="min-h-screen bg-[#0d0b21] text-white p-6 md:p-12 flex flex-col items-center justify-start space-y-8 font-sans">
      
      {/* Platform Screen Branding Header */}
      <div className="text-center flex flex-col items-center max-w-xl">
        <div className="p-4 bg-purple-600/10 text-purple-400 rounded-3xl mb-4 shadow-xl border border-purple-500/10">
          <Mic size={44} className="animate-pulse" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-purple-400 bg-clip-text text-transparent">
          Vocal Transcription Studio
        </h1>
        <p className="text-gray-400 text-sm mt-2">
          Private, enterprise-grade transcription powered by a self-hosted faster-whisper large-v3 deployment engine.
        </p>
      </div>

      {/* Hardware Access Exception Callout Warning Container */}
      {micPermissionDenied && (
        <div className="w-full max-w-lg bg-red-950/20 border border-red-500/30 p-4 rounded-2xl flex items-start gap-3 text-red-200 text-sm animate-fadeIn">
          <AlertTriangle className="text-red-400 shrink-0 mt-0.5" size={18} />
          <p>Microphone access denied. Please allow microphone processing permissions in your system settings to capture audio files locally.</p>
        </div>
      )}

      {/* Main Recording Interactive State Action Card Container */}
      <div className="bg-[#191635] w-full max-w-lg rounded-3xl border border-purple-900/20 p-8 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-40"></div>
        
        {!audioBlob ? (
          <div className="space-y-6">
            <p className="text-sm text-gray-400">
              {isRecording ? "Inference line listening... Click stop when finished speaking." : "Ready to register sound waves. Tap below to prompt recording hardware."}
            </p>
            
            <button 
              onClick={isRecording ? stopRecording : startRecording}
              className={`px-8 py-4 rounded-full font-bold flex items-center gap-3 mx-auto shadow-xl transform hover:scale-105 transition-all duration-300 ${
                isRecording 
                  ? 'bg-red-600 hover:bg-red-500 text-white ring-4 ring-red-500/20' 
                  : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-cyan-500/10 hover:shadow-cyan-500/20'
              }`}
            >
              {isRecording ? <Square size={16} className="fill-white" /> : <Mic size={16} />}
              {isRecording ? 'Stop Session' : 'Start Recording'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3 text-cyan-400 bg-cyan-500/5 p-4 rounded-xl border border-cyan-500/10 w-fit mx-auto">
              <FileAudio size={22} />
              <span className="text-xs font-bold tracking-wider uppercase">Audio Byte Stream Encapsulated</span>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={uploadAudioToBackend}
                disabled={isUploading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-500/10 disabled:opacity-40 transition-all"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>Processing Inference...</span>
                  </>
                ) : (
                  <span>Transcribe Audio File</span>
                )}
              </button>
              
              <button 
                onClick={clearWorkspace}
                disabled={isUploading}
                className="px-4 border border-purple-900/40 hover:bg-white/5 rounded-xl text-gray-400 hover:text-white transition-all disabled:opacity-30"
              >
                <RefreshCw size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Machine Learning Output Segment Blocks Render Section Container */}
      {transcriptionResult && (
        <div className="w-full max-w-lg bg-[#191635]/50 border border-purple-950/40 rounded-3xl p-6 space-y-5 shadow-2xl backdrop-blur-md animate-fadeIn">
          
          <div className="flex justify-between items-center text-xs font-mono border-b border-purple-950/40 pb-3 text-gray-400">
            <span className="flex items-center gap-1.5">
              <Languages size={14} className="text-purple-400" />
              <span>Detected Script: <b className="text-cyan-400 uppercase font-bold">{transcriptionResult.language}</b></span>
            </span>
            <span className="text-emerald-400 font-medium bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">Pipeline Stabilized</span>
          </div>

          <div>
            <label className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block mb-2">Native Language Transcript</label>
            <p className="text-white text-base bg-[#0d0b21]/60 p-4 rounded-2xl border border-purple-950/40 leading-relaxed font-sans shadow-inner">
              {transcriptionResult.text || "No speech signals deciphered down the channel runtime."}
            </p>
          </div>

          <div className="space-y-2.5">
            <label className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block">Inference Time Segments</label>
            <div className="space-y-2 max-h-44 overflow-y-auto pr-1 scrollbar-thin">
              {transcriptionResult.segments?.map((seg, idx) => (
                <div key={idx} className="flex gap-3 items-start bg-[#0d0b21]/30 p-3 rounded-xl border border-purple-950/10 text-xs hover:border-purple-500/20 transition-all">
                  <span className="font-mono text-purple-300 bg-purple-950/40 px-2.5 py-0.5 rounded text-[10px] tracking-tight shrink-0 mt-0.5">
                    {seg.start.toFixed(1)}s - {seg.end.toFixed(1)}s
                  </span>
                  <span className="text-gray-300 leading-relaxed font-sans">{seg.text}</span>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      )}
      
    </div>
  );
}