import React, { useState } from 'react';
import STTModule from './components/STTModule';
import TTSModule from './components/TTSModule';
import { Mic, Volume2, Shield, Layers, HelpCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState("stt"); // Workspace choices: 'stt' | 'tts'

  return (
    <div className="min-h-screen bg-[#090714] text-gray-100 flex font-sans antialiased selection:bg-purple-500/30 selection:text-purple-200">
      
      {/* 🚀 Sidebar Navigation Array */}
      <aside className="w-64 bg-[#0d0b21]/80 border-r border-purple-500/5 flex flex-col justify-between hidden md:flex shrink-0">
        <div className="p-6 space-y-8">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 bg-purple-600 rounded-xl text-white shadow-lg shadow-purple-600/20">
              <Layers size={18} />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight">Vocal Matrix</h1>
              <p className="text-[10px] text-purple-400/70 font-mono tracking-wider uppercase font-bold">Studio v1.2</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab("stt")}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === "stt"
                  ? "bg-purple-600/10 text-purple-300 border border-purple-500/10 shadow-inner"
                  : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
              }`}
            >
              <Mic size={16} />
              Speech to Text
            </button>

            <button
              onClick={() => setActiveTab("tts")}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === "tts"
                  ? "bg-purple-600/10 text-purple-300 border border-purple-500/10 shadow-inner"
                  : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
              }`}
            >
              <Volume2 size={16} />
              Text to Speech
            </button>
          </nav>
        </div>

        <div className="p-4 m-4 rounded-2xl bg-[#120f2b]/40 border border-purple-500/5 space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 font-semibold uppercase tracking-wider">
            <Shield size={12} />
            <span>Local Compute</span>
          </div>
          <p className="text-[11px] text-gray-500 leading-normal">
            Your processing metrics are secured. No telemetry vectors exit the cloud container.
          </p>
        </div>
      </aside>

      {/* 🚀 Main Display Panel Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen relative">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-[128px] pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-600/5 rounded-full blur-[128px] pointer-events-none"></div>

        {/* Global Dynamic Module Header */}
        <header className="p-6 md:px-12 md:py-8 border-b border-purple-500/5 flex justify-between items-center bg-[#090714]/40 backdrop-blur-md relative z-10">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight capitalize">
              {activeTab === "stt" ? "Acoustic Transcription Engine" : "Vocal Waveform Synthesizer"}
            </h2>
            <p className="text-gray-500 text-xs mt-0.5">
              {activeTab === "stt" 
                ? "Host-isolated inference mapping utilizing faster-whisper structures." 
                : "Dynamic text parameter encoding across localized speech synthesis arrays."}
            </p>
          </div>
          
          {/* Fallback Mobile Header Switcher */}
          <div className="md:hidden bg-[#120f2b] p-1 rounded-xl border border-purple-500/10 flex gap-1">
            <button 
              onClick={() => setActiveTab("stt")}
              className={`p-2 rounded-lg ${activeTab === 'stt' ? 'bg-purple-600 text-white' : 'text-gray-400'}`}
            >
              <Mic size={14} />
            </button>
            <button 
              onClick={() => setActiveTab("tts")}
              className={`p-2 rounded-lg ${activeTab === 'tts' ? 'bg-purple-600 text-white' : 'text-gray-400'}`}
            >
              <Volume2 size={14} />
            </button>
          </div>
        </header>

        {/* Dynamic Component Insertion Space */}
        <div className="flex-1 p-6 md:p-12 relative z-10 max-w-5xl w-full">
          {activeTab === "stt" ? <STTModule /> : <TTSModule />}
        </div>
      </main>

    </div>
  );
}