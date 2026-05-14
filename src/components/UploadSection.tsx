import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UploadCloud, FileVideo, ShieldAlert, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

// Helper audio synthesizer for button sound
function playClickSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    // Ignore audio context creation errors (e.g. strict auto-play policies)
    console.error("Audio play failed", e);
  }
}

interface UploadSectionProps {
  onAnalyze: (file: File) => void;
  isAnalyzing: boolean;
  analyzeCount: number;
  maxFree: number;
  isPro: boolean;
}

export default function UploadSection({ onAnalyze, isAnalyzing, analyzeCount, maxFree, isPro }: UploadSectionProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsHovered(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('video/')) {
        setFile(droppedFile);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyzeClick = () => {
    playClickSound();
    if (file) {
      onAnalyze(file);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 mb-24 relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000 -z-10 animate-pulse"></div>
      
      <div 
        className={cn(
          "glass-panel rounded-3xl p-8 border border-white/5 transition-all duration-300",
          isHovered ? "border-white/20 bg-white/5" : "",
          isAnalyzing ? "opacity-50 pointer-events-none" : ""
        )}
        onDragOver={(e) => { e.preventDefault(); setIsHovered(true); }}
        onDragLeave={() => setIsHovered(false)}
        onDrop={handleDrop}
      >
        {!file ? (
          <div className="flex flex-col items-center justify-center py-16 text-center cursor-pointer" onClick={() => inputRef.current?.click()}>
            <input type="file" ref={inputRef} accept="video/*" className="hidden" onChange={handleChange} />
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 glow-blue"
            >
              <UploadCloud className="w-10 h-10 text-blue-500" />
            </motion.div>
            <h3 className="text-2xl font-semibold mb-2">Upload your Video</h3>
            <p className="text-[#8E9299] max-w-sm">Drop your MP4, MOV, or AVI file here, or click to browse. Let AI be your brutal critic.</p>
            <div className="mt-4 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-mono font-medium">
              {isPro ? (
                  <span className="text-purple-500 font-bold flex items-center justify-center gap-1">
                    <Sparkles className="w-3 h-3" /> Pro Active - Unlimited Analyses
                  </span>
              ) : (
                  <span className={analyzeCount >= maxFree ? "text-purple-500 font-bold" : "text-[#8E9299]"}>
                    {Math.max(0, maxFree - analyzeCount)} / {maxFree} free analyses remaining
                  </span>
              )}
            </div>
            <div className="mt-8 flex gap-4 text-xs font-mono text-[#8E9299]">
              <span className="flex items-center gap-1"><ShieldAlert className="w-3 h-3"/> Secure Processing</span>
              <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-purple-500"/> Gemini AI</span>
            </div>
          </div>
        ) : (
          <div className="py-8">
             <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl mb-8">
               <div className="flex items-center gap-4">
                 <div className="p-3 bg-white/10 rounded-lg">
                   <FileVideo className="w-8 h-8 text-purple-500" />
                 </div>
                 <div>
                   <h4 className="font-medium max-w-[200px] truncate">{file.name}</h4>
                   <p className="text-sm text-[#8E9299]">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                 </div>
               </div>
               <button 
                onClick={() => setFile(null)}
                className="text-sm text-white/50 hover:text-white transition-colors cursor-pointer"
                disabled={isAnalyzing}
               >
                 Cancel
               </button>
             </div>
             
             <motion.button
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAnalyzeClick}
                disabled={isAnalyzing}
                className="w-full py-4 rounded-xl relative overflow-hidden bg-gradient-to-r from-blue-500 hover:from-blue-400 to-purple-600 hover:to-purple-500 text-white font-bold text-lg flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all cursor-pointer group"
             >
                <div className="absolute inset-0 bg-white/20 translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-500"></div>
               {isAnalyzing ? (
                 <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Analyzing Edit...
                 </>
               ) : (analyzeCount >= maxFree && !isPro) ? (
                 <>
                  <Sparkles className="w-6 h-6" />
                  Unlock Pro to Analyze
                 </>
               ) : (
                 <>
                  <Sparkles className="w-6 h-6" />
                  Analyze My Video
                 </>
               )}
             </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}
