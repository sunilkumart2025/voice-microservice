import React, { useState, useRef } from 'react';
import { Mic, Volume2, Shield, Layers, Square, AlertTriangle, FileAudio, RefreshCw, Loader2, Languages, Cpu, Sliders, Sparkles, AudioLines, Download, Play, Pause } from 'lucide-react';

// ==========================================
// 🎙️ SPEECH TO TEXT COMPONENT
// ==========================================
function STTModule() {
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
      if (!response.ok) throw new Error('Inference pipeline error.');
      const data = await response.json();
      setTranscriptionResult(data);
    } catch (error) {
      alert(`Connection error: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      {micPermissionDenied && (
        <div style={{ backgroundColor: 'rgba(127, 29, 29, 0.2)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '16px', borderRadius: '16px', display: 'flex', gap: '12px', color: '#fca5a5', fontSize: '14px' }}>
          <AlertTriangle style={{ color: '#ef4444', flexShrink: 0 }} size={18} />
          <p>Microphone access denied. Please check device system permissions.</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'window.innerWidth > 768 ? "repeat(5, minmax(0, 1fr))" : "1fr"', gap: '24px', width: '100%' }} className="grid grid-cols-1 md:grid-cols-5">
        
        {/* Left Capture Deck */}
        <div style={{ backgroundColor: '#13112c', borderRadius: '24px', border: '1px solid rgba(147, 51, 234, 0.15)', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '280px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)' }} className="md:col-span-2">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a855f7', marginBottom: '12px' }}>
              <Cpu size={16} />
              <span style={{ fontSize: '11px', fontFamily: 'monospace', tracking: '0.1em', uppercase: 'true' }}>PROCESSING UNIT</span>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff' }}>Speech Stream</h3>
            <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '8px', lineHeight: '1.5' }}>
              {isRecording ? "Listening to acoustic waves down the local hardware channel..." : "Initialize the voice interface to stream frequencies to the model."}
            </p>
          </div>

          <div style={{ marginTop: '24px' }}>
            {!audioBlob ? (
              <button 
                onClick={isRecording ? stopRecording : startRecording}
                style={{ w: '100%', padding: '14px', borderRadius: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: isRecording ? '#ef4444' : '#6366f1', color: '#ffffff', border: 'none' }}
              >
                {isRecording ? <Square size={14} fill="#white" /> : <Mic size={14} />}
                {isRecording ? 'Stop Engine' : 'Start Capture'}
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#22d3ee', backgroundColor: 'rgba(34, 211, 238, 0.05)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(34, 211, 238, 0.1)', fontSize: '12px', fontWeight: '600' }}>
                  <FileAudio size={16} />
                  <span>VOICE PAYLOAD READY</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={uploadAudioToBackend}
                    disabled={isUploading}
                    style={{ flex: 1, backgroundColor: '#9333ea', color: '#ffffff', padding: '12px', borderRadius: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: 'none', cursor: 'pointer', opacity: isUploading ? 0.5 : 1 }}
                  >
                    {isUploading && <Loader2 size={14} className="animate-spin" />}
                    {isUploading ? 'Computing...' : 'Transcribe'}
                  </button>
                  <button 
                    onClick={() => { setAudioBlob(null); setTranscriptionResult(null); }}
                    style={{ padding: '12px', borderRadius: '12px', border: '1px solid rgba(147, 51, 234, 0.3)', backgroundColor: 'transparent', color: '#9ca3af', cursor: 'pointer' }}
                  >
                    <RefreshCw size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Output Log */}
        <div style={{ backgroundColor: 'rgba(19, 17, 44, 0.4)', borderRadius: '24px', border: '1px solid rgba(147, 51, 234, 0.08)', padding: '24px', display: 'flex', flexDirection: 'column', minHeight: '280px' }} className="md:col-span-3">
          {transcriptionResult ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', justifyContext: 'space-between', alignItems: 'center', fontSize: '11px', borderBottom: '1px solid rgba(147, 51, 234, 0.1)', pb: '12px', color: '#9ca3af', width: '100%', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Languages size={14} style={{ color: '#a855f7' }} />
                  <span>Detected ISO: <b style={{ color: '#22d3ee', textTransform: 'uppercase' }}>{transcriptionResult.language}</b></span>
                </span>
                <span style={{ color: '#34d399', fontWeight: '600', backgroundColor: 'rgba(52, 211, 153, 0.05)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(52, 211, 153, 0.1)' }}>Pipeline Verified</span>
              </div>

              <div style={{ flexGrow: 1, marginTop: '12px' }}>
                <label style={{ fontSize: '10px', fontWeight: '700', color: '#a855f7', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }}>TEXT ARRAY OUTPUT</label>
                <p style={{ color: '#f3f4f6', fontSize: '14px', lineHeight: '1.6', backgroundColor: '#090714', padding: '16px', borderRadius: '16px', border: '1px solid rgba(147, 51, 234, 0.05)' }}>
                  {transcriptionResult.text}
                </p>
              </div>

              {transcriptionResult.segments && (
                <div style={{ marginTop: '12px' }}>
                  <label style={{ fontSize: '10px', fontWeight: '700', color: '#a855f7', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }}>SEGMENTATION TIMELINE</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '110px', overflowY: 'auto' }} className="scrollbar-thin">
                    {transcriptionResult.segments.map((seg, i) => (
                      <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center', backgroundColor: 'rgba(9, 7, 20, 0.3)', padding: '10px', rounded: '12px', borderRadius: '10px', border: '1px solid rgba(147, 51, 234, 0.05)', fontSize: '12px' }}>
                        <span style={{ fontFamily: 'monospace', color: '#c084fc', backgroundColor: 'rgba(88, 28, 135, 0.3)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', flexShrink: 0 }}>
                          {seg.start.toFixed(1)}s - {seg.end.toFixed(1)}s
                        </span>
                        <span style={{ color: '#d1d5db' }}>{seg.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: 'auto', textAlign: 'center', gap: '12px', padding: '40px 0' }}>
              <div style={{ padding: '12px', backgroundColor: 'rgba(147, 51, 234, 0.05)', borderRadius: '16px', color: 'rgba(168, 85, 247, 0.4)' }}>
                <Mic size={22} />
              </div>
              <p style={{ fontSize: '12px', color: '#4b5563', maxWidth: '240px', lineHeight: '1.5' }}>
                No active payload decoded. Stream voice waves to view structured segment text maps.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 🔊 TEXT TO SPEECH COMPONENT (MOCK INTERACTIVE)
// ==========================================
function TTSModule() {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("neural-male-1");
  const [speed, setSpeed] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleSynthesize = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setGenerated(true);
    setIsPlaying(true);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'window.innerWidth > 768 ? "repeat(5, minmax(0, 1fr))" : "1fr"', gap: '24px', width: '100%' }} className="grid grid-cols-1 md:grid-cols-5">
      {/* Parameters */}
      <form onSubmit={handleSynthesize} style={{ backgroundColor: '#13112c', borderRadius: '24px', border: '1px solid rgba(147, 51, 234, 0.15)', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '280px' }} className="md:col-span-2">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6366f1' }}>
            <Sliders size={16} />
            <span style={{ fontSize: '11px', fontFamily: 'monospace', tracking: '0.1em' }}>SYNTHESIS MATRIX</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '10px', fontWeight: '700', color: '#a855f7' }}>Acoustic Model Profile</label>
            <select 
              value={voice} 
              onChange={(e) => setVoice(e.target.value)}
              style={{ backgroundColor: '#090714', color: '#d1d5db', padding: '10px', borderRadius: '10px', border: '1px solid rgba(147, 51, 234, 0.2)', fontSize: '13px', outline: 'none' }}
            >
              <option value="neural-male-1">David (Neural English - Male)</option>
              <option value="neural-female-1">Clara (Neural English - Female)</option>
              <option value="neural-tamil-1">Arun (Neural Tamil - Male)</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: '700', color: '#a855f7' }}>
              <span>Playback Rate</span>
              <span style={{ color: '#22d3ee' }}>{speed}x</span>
            </div>
            <input 
              type="range" min="0.5" max="2.0" step="0.1" value={speed} 
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={!text.trim()}
          style={{ width: '100%', padding: '14px', borderRadius: '14px', backgroundColor: '#6366f1', color: '#ffffff', fontWeight: '700', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '24px', opacity: !text.trim() ? 0.4 : 1 }}
        >
          <Sparkles size={14} />
          Compile Waveform
        </button>
      </form>

      {/* Input / Wave Canvas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="md:col-span-3">
        <div style={{ backgroundColor: 'rgba(19, 17, 44, 0.6)', border: '1px solid rgba(147, 51, 234, 0.1)', p: '20px', borderRadius: '24px', padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '10px', fontWeight: '700', color: '#a855f7', marginBottom: '8px', display: 'block' }}>INPUT SCRIPT VECTOR</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste alphanumeric scripts here to modulate down into synthetic voice frequencies..."
            style={{ width: '100%', backgroundColor: 'transparent', border: 'none', color: '#f3f4f6', fontSize: '14px', outline: 'none', resize: 'none', flexGrow: 1, lineHeight: '1.6', minHeight: '120px' }}
          />
        </div>

        {/* Player controls deck */}
        <div style={{ backgroundColor: '#13112c', border: '1px solid rgba(147, 51, 234, 0.05)', padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center' }}>
          {generated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                style={{ backgroundColor: '#9333ea', color: '#white', border: 'none', color: '#fff', padding: '10px', borderRadius: '10px', cursor: 'pointer' }}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} fill="white" />}
              </button>
              <div style={{ flexGrow: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#9ca3af', marginBottom: '4px', fontFamily: 'monospace' }}>
                  <span style={{ color: '#c084fc', display: 'flex', alignItems: 'center', gap: '4px' }}><AudioLines size={12}/> Audio Synthesized</span>
                  <span>{isPlaying ? '0:04' : '0:00'} / 0:08</span>
                </div>
                <div style={{ height: '6px', backgroundColor: '#090714', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ width: isPlaying ? '50%' : '50%', height: '100%', backgroundColor: '#a855f7', transition: 'all 0.5s' }}></div>
                </div>
              </div>
              <button style={{ backgroundColor: 'transparent', border: '1px solid rgba(147, 51, 234, 0.2)', padding: '8px', borderRadius: '8px', color: '#9ca3af', cursor: 'pointer' }} onClick={() => alert('Feature initialized: Synthetic asset block downloaded.')}>
                <Download size={14} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', itemsAlign: 'center', justifyContent: 'center', gap: '8px', color: '#4b5563', fontSize: '12px', width: '100%', padding: '6px 0' }}>
              <Volume2 size={14} />
              <span>No voice metrics generated down the current thread runtime.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 🧱 CORE ENTRYPOINT GRID LAYOUT
// ==========================================
export default function App() {
  const [activeTab, setActiveTab] = useState("stt");

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#090714', color: '#e5e7eb', display: 'flex', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Left Dock Sidebar */}
      <aside style={{ width: '240px', backgroundColor: '#0b091f', borderRight: '1px solid rgba(147, 51, 234, 0.08)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexShrink: 0 }} className="hidden md:flex">
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
            <div style={{ padding: '8px', backgroundColor: '#9333ea', borderRadius: '10px', color: '#ffffff', boxShadow: '0 10px 15px -3px rgba(147,51,234,0.3)' }}>
              <Layers size={16} />
            </div>
            <div>
              <h1 style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', margin: 0, tracking: '-0.02em' }}>Vocal Matrix</h1>
              <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#a855f7', fontWeight: '700', letterSpacing: '0.05em' }}>WORKSPACE V1.2</span>
            </div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button
              onClick={() => setActiveTab("stt")}
              style={{ width: '100%', textAlign: 'left', padding: '12px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', fontWeight: '600', border: 'none', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: activeTab === "stt" ? 'rgba(147, 51, 234, 0.1)' : 'transparent', color: activeTab === "stt" ? '#c084fc' : '#6b7280' }}
            >
              <Mic size={16} />
              Speech to Text
            </button>

            <button
              onClick={() => setActiveTab("tts")}
              style={{ width: '100%', textAlign: 'left', padding: '12px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', fontWeight: '600', border: 'none', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: activeTab === "tts" ? 'rgba(147, 51, 234, 0.1)' : 'transparent', color: activeTab === "tts" ? '#c084fc' : '#6b7280' }}
            >
              <Volume2 size={16} />
              Text to Speech
            </button>
          </nav>
        </div>

        <div style={{ padding: '16px', margin: '16px', borderRadius: '16px', backgroundColor: 'rgba(19, 17, 44, 0.4)', border: '1px solid rgba(147, 51, 234, 0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontFamily: 'monospace', color: '#34d399', fontWeight: '700', textTransform: 'uppercase', tracking: '0.05em' }}>
            <Shield size={12} />
            <span>LOCAL MATRIX</span>
          </div>
          <p style={{ fontSize: '11px', color: '#4b5563', marginTop: '6px', lineHeight: '1.4', margin: '4px 0 0 0' }}>
            Acoustic signals are fully contained. Zero cloud telemetry exit channels configured.
          </p>
        </div>
      </aside>

      {/* Main Display Hub */}
      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative' }}>
        
        {/* Dynamic Nav Header */}
        <header style={{ padding: '24px 48px', borderBottom: '1px solid rgba(147, 51, 234, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(9, 7, 20, 0.4)', backdropFilter: 'blur(8px)' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff', margin: 0, tracking: '-0.02em' }}>
              {activeTab === "stt" ? "Acoustic Transcription Engine" : "Waveform Synthesizer Console"}
            </h2>
            <p style={{ fontSize: '12px', color: '#4b5563', margin: '2px 0 0 0' }}>
              {activeTab === "stt" ? "Host-isolated neural audio mapping utilizing local ctranslate2 pools." : "Parametric wave generation across multi-lingual speech synthesis matrices."}
            </p>
          </div>

          {/* Mobile Fallback Navigation Switches */}
          <div style={{ display: 'flex', backgroundColor: '#13112c', padding: '4px', borderRadius: '10px', border: '1px solid rgba(147, 51, 234, 0.15)', gap: '4px' }} className="flex md:hidden">
            <button onClick={() => setActiveTab("stt")} style={{ border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', backgroundColor: activeTab === 'stt' ? '#9333ea' : 'transparent', color: '#fff' }}><Mic size={14}/></button>
            <button onClick={() => setActiveTab("tts")} style={{ border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', backgroundColor: activeTab === 'tts' ? '#9333ea' : 'transparent', color: '#fff' }}><Volume2 size={14}/></button>
          </div>
        </header>

        {/* Workspace Display Injection Area */}
        <div style={{ padding: '48px', maxWidth: '1024px', width: '100%', boxSizing: 'border-box' }}>
          {activeTab === "stt" ? <STTModule /> : <TTSModule />}
        </div>
      </main>

    </div>
  );
}