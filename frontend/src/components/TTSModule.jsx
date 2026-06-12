import React, { useState } from 'react';
import { Volume2, Play, Pause, Sliders, AudioLines, Sparkles, Download } from 'lucide-react';

export default function TTSModule() {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("neural-male-1");
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [generatedAudio, setGeneratedAudio] = useState(false);

  const handleSynthesize = (e) => {
    e.preventDefault();
    if (!text.strip) return;
    setIsPlaying(false);
    setGeneratedAudio(true);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full transition-all duration-300">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        
        {/* Left Parameters Card */}
        <form onSubmit={handleSynthesize} className="md:col-span-2 bg-[#120f2b]/60 backdrop-blur-xl rounded-3xl border border-purple-500/10 p-6 space-y-5 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 via-transparent to-transparent opacity-50"></div>
          
          <div className="relative space-y-4">
            <div className="flex items-center gap-2 text-indigo-400">
              <Sliders size={18} />
              <span className="text-xs font-mono tracking-wider uppercase">Voice Synthesis</span>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block">Acoustic Model Profile</label>
              <select 
                value={voice} 
                onChange={(e) => setVoice(e.target.value)}
                className="w-full bg-[#090714]/80 text-sm text-gray-200 p-3 rounded-xl border border-purple-500/10 focus:outline-none focus:border-purple-500/40"
              >
                <option value="neural-male-1">David (Neural English - Male)</option>
                <option value="neural-female-1">Clara (Neural English - Female)</option>
                <option value="neural-tamil-1">Arun (Neural Tamil - Male)</option>
                <option value="neural-hindi-1">Priya (Neural Hindi - Female)</option>
              </select>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-[10px] font-bold text-purple-400 uppercase tracking-widest">
                <span>Speed Metrics</span>
                <span className="font-mono text-cyan-400">{speed}x</span>
              </div>
              <input 
                type="range" min="0.5" max="2.0" step="0.1" value={speed} 
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full accent-purple-500 h-1 bg-purple-950 rounded-lg cursor-pointer"
              />

              <div className="flex justify-between items-center text-[10px] font-bold text-purple-400 uppercase tracking-widest pt-1">
                <span>Vocal Pitch</span>
                <span className="font-mono text-cyan-400">{pitch}x</span>
              </div>
              <input 
                type="range" min="0.5" max="1.5" step="0.1" value={pitch} 
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="w-full accent-purple-500 h-1 bg-purple-950 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={!text.trim()}
            className="relative w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 disabled:opacity-30 disabled:pointer-events-none hover:opacity-90 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg cursor-pointer text-sm"
          >
            <Sparkles size={16} />
            Generate Audio Node
          </button>
        </form>

        {/* Right Input and Output Workspace */}
        <div className="md:col-span-3 space-y-4 flex flex-col justify-between min-h-[350px]">
          
          {/* Main Input Text Area */}
          <div className="bg-[#120f2b]/40 backdrop-blur-xl rounded-3xl border border-purple-500/10 p-5 flex-1 flex flex-col shadow-xl">
            <label className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block mb-2">Input Script Layer</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type text matrix packages here... The synthesis block will generate high-fidelity output frequencies."
              maxLength={400}
              className="w-full flex-1 bg-transparent text-gray-200 text-sm resize-none focus:outline-none placeholder-gray-600 leading-relaxed font-sans scrollbar-thin"
            />
            <div className="text-right text-[10px] font-mono text-gray-600 mt-2">
              {text.length}/400 characters
            </div>
          </div>

          {/* Player Controls Container */}
          <div className="bg-[#120f2b]/20 rounded-2xl border border-purple-500/5 p-4 flex items-center justify-between">
            {generatedAudio ? (
              <div className="flex items-center gap-4 w-full animate-fadeIn">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-md transition-all cursor-pointer"
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} className="fill-white ml-0.5" />}
                </button>
                
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono text-gray-400">
                    <span className="text-purple-400 flex items-center gap-1"><AudioLines size={12}/> Synthesis Stream</span>
                    <span>0:00 / 0:14</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#090714] rounded-full overflow-hidden relative border border-purple-900/10">
                    <div 
                      className={`h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full ${isPlaying ? 'w-1/3 transition-all duration-1000' : 'w-1/3'}`}
                    ></div>
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={() => alert("Mock Asset Deployment: Binary array download stream bypassed successfully.")}
                  className="p-2.5 border border-purple-500/20 text-gray-400 hover:text-purple-400 hover:bg-purple-500/5 rounded-xl transition-all cursor-pointer"
                  title="Download Compiled Wave"
                >
                  <Download size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-gray-600 text-xs w-full py-2 justify-center">
                <Volume2 size={16} />
                <span>No voice asset generated down the runtime layer yet.</span>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}