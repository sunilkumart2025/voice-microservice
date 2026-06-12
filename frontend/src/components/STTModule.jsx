import React, { useState, useRef } from 'react';
import { Mic, Square, AlertTriangle, FileAudio, RefreshCw, Loader2, Languages, Cpu } from 'lucide-react';

export default function STTModule() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

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
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      setMicPermissionDenied(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const uploadAudioToBackend = async () => {
    if (!audioBlob) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', audioBlob, 'user_voice_capture.webm');

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://voice-stt-backend.onrender.com';

    try {
      const response = await fetch(`${BACKEND_URL}/v1/stt`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Inference pipeline computation crash.');
      
      const data = await response.json();
      setTranscriptionResult(data);
    } catch (error) {
      alert(`System connection error: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full transition-all duration-300">
      
      {micPermissionDenied && (
        <div className="bg-red-950/30 border border-red-500/20 p-4 rounded-2xl flex items-start gap-3 text-red-200 text-sm">
          <AlertTriangle className="text-red-400 shrink-0 mt-0.5" size={18} />
          <p>Microphone access denied. Please allow microphone processing permissions in your system settings.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        
        {/* Left Control Card */}
        <div className="md:col-span-2 bg-[#120f2b]/60 backdrop-blur-xl rounded-3xl border border-purple-500/10 p-6 flex flex-col justify-between shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-transparent opacity-50"></div>
          
          <div className="relative space-y-4">
            <div className="flex items-center gap-2 text-purple-400">
              <Cpu size={18} />
              <span className="text-xs font-mono tracking-wider uppercase">Pipeline Worker</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">Speech Engine</h2>
            <p className="text-gray-400 text-xs leading-relaxed">
              {isRecording ? "Capturing real-time acoustic waves down the line..." : "Press start to hook into your device's audio hardware stream."}
            </p>
          </div>

          <div className="relative pt-8 space-y-4">
            {!audioBlob ? (
              <button 
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-400 text-white ring-4 ring-red-500/10' 
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20 hover:opacity-90'
                }`}
              >
                {isRecording ? <Square size={16} className="fill-white" /> : <Mic size={16} />}
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-cyan-400 bg-cyan-500/5 p-3 rounded-xl border border-cyan-500/10 text-xs font-semibold">
                  <FileAudio size={16} />
                  <span>Audio Captured Successfully</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={uploadAudioToBackend}
                    disabled={isUploading}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg disabled:opacity-40 cursor-pointer text-sm"
                  >
                    {isUploading ? <Loader2 className="animate-spin" size={16} /> : null}
                    {isUploading ? 'Transcribing...' : 'Run Transcription'}
                  </button>
                  <button 
                    onClick={() => { setAudioBlob(null); setTranscriptionResult(null); }}
                    disabled={isUploading}
                    className="px-3 border border-purple-500/20 hover:bg-white/5 rounded-xl text-gray-400 hover:text-white transition-all disabled:opacity-30 cursor-pointer"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Output Area */}
        <div className="md:col-span-3 bg-[#120f2b]/30 backdrop-blur-xl rounded-3xl border border-purple-500/5 p-6 flex flex-col justify-between shadow-inner min-h-[300px]">
          {transcriptionResult ? (
            <div className="space-y-4 w-full h-full flex flex-col justify-between">
              <div className="flex justify-between items-center text-[11px] font-mono border-b border-purple-500/10 pb-3 text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Languages size={14} className="text-purple-400" />
                  <span>Language ISO: <b className="text-cyan-400 uppercase">{transcriptionResult.language}</b></span>
                </span>
                <span className="text-emerald-400 font-medium bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">Pipeline Stabilized</span>
              </div>

              <div className="flex-1 py-2">
                <label className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block mb-2">Normalized Text</label>
                <p className="text-gray-100 text-sm leading-relaxed bg-[#090714]/40 p-4 rounded-xl border border-purple-500/5 shadow-inner">
                  {transcriptionResult.text}
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block">Timestamp Matrix</label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 scrollbar-thin">
                  {transcriptionResult.segments?.map((seg, idx) => (
                    <div key={idx} className="flex gap-3 items-center bg-[#090714]/20 p-2.5 rounded-xl border border-purple-500/5 text-xs">
                      <span className="font-mono text-purple-300 bg-purple-950/40 px-2 py-0.5 rounded text-[10px] tracking-tight shrink-0">
                        {seg.start.toFixed(1)}s - {seg.end.toFixed(1)}s
                      </span>
                      <span className="text-gray-300 font-sans">{seg.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-3 m-auto py-12">
              <div className="p-3 bg-purple-600/5 rounded-2xl border border-purple-500/10 text-purple-400/40">
                <Mic size={24} />
              </div>
              <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                No active payload decoded. Run the pipeline stream to view live structured segment matrices.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}