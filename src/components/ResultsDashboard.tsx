import { motion } from 'motion/react';
import type { VideoAnalysisResult } from '../lib/gemini';
import { Play, TrendingUp, AlertTriangle, CheckCircle2, Zap, BrainCircuit, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

interface ResultsDashboardProps {
  result: VideoAnalysisResult;
  videoUrl: string;
}

export default function ResultsDashboard({ result, videoUrl }: ResultsDashboardProps) {

  const ScoreCard = ({ title, score, icon: Icon, color }: { title: string, score: number, icon: any, color: string }) => (
    <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden group">
      <div className={cn("absolute inset-0 opacity-10 bg-gradient-to-t outline-none", color)}></div>
      <Icon className="w-8 h-8 mb-4 opacity-70" />
      <span className="text-4xl font-mono font-bold mb-1">{score}<span className="text-xl text-[--color-text-dim]">/10</span></span>
      <span className="font-medium text-sm tracking-widest uppercase text-[--color-text-dim] group-hover:text-white transition-colors">{title}</span>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-6xl mx-auto space-y-8"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-6 glass-panel p-6 md:p-8 rounded-3xl">
        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 flex flex-col sm:flex-row items-center gap-3">
             AI Edit Analysis
             <span className="px-3 py-1 bg-white/10 rounded-full text-xs sm:text-sm font-mono text-[--color-neon-green] border border-[--color-neon-green]/30">Complete</span>
          </h2>
          <p className="text-[#8E9299] text-sm md:text-base">Overall rating based on industry-standard viral metrics.</p>
        </div>
        
        <div className="flex items-center gap-4 sm:gap-6 w-full md:w-auto justify-center">
           <div className="text-center md:text-right">
             <div className="text-xs sm:text-sm font-mono tracking-widest uppercase text-[#8E9299] mb-1 flex-1">Viral Potential</div>
             <div className="text-3xl sm:text-4xl font-bold text-orange-500 glow-text">{result.scores.viralPotential}/10</div>
           </div>
           <div className="w-[1px] sm:w-[2px] h-12 sm:h-16 bg-white/10"></div>
           <div className="text-center md:text-right">
             <div className="text-xs sm:text-sm font-mono tracking-widest uppercase text-[#8E9299] mb-1">Overall Rank</div>
             <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
               {result.scores.overall >= 8 ? 'A+' : result.scores.overall >= 7 ? 'B' : result.scores.overall >= 5 ? 'C' : 'D'}
             </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <ScoreCard title="Editing" score={result.scores.editing} icon={Play} color="from-[--color-neon-blue] to-transparent" />
        <ScoreCard title="Audio" score={result.scores.audio} icon={Activity} color="from-[--color-neon-purple] to-transparent" />
        <ScoreCard title="Color" score={result.scores.color} icon={Zap} color="from-[--color-neon-green] to-transparent" />
        <ScoreCard title="Engagement" score={result.scores.engagement} icon={TrendingUp} color="from-[--color-neon-orange] to-transparent" />
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
           <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
             <video src={videoUrl} controls className="w-full rounded-xl object-contain bg-black/50 aspect-[9/16] shadow-2xl" />
             <div className="absolute top-8 left-8 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border border-white/10 inline-flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[--color-neon-red] animate-pulse"></div>
                Analyzing...
             </div>
           </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="glass-panel p-8 rounded-2xl bg-gradient-to-br from-white/5 to-transparent">
             <h3 className="font-bold text-xl mb-6 flex items-center gap-2"><BrainCircuit className="w-6 h-6 text-[--color-neon-purple]" /> Hook Analyzer <span className="ml-2 text-xs font-mono font-medium opacity-50 uppercase">(First 3 Seconds)</span></h3>
             
             <div className="grid sm:grid-cols-2 gap-6 mb-6">
               <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="text-sm text-[--color-text-dim] mb-2 font-mono">Attention Grab</div>
                  <div className="font-semibold">{result.hookAnalysis.attentionGrab ? (
                    <span className="text-[--color-neon-green] flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Strong start detected</span>
                  ) : (
                    <span className="text-[--color-neon-red] flex items-center gap-2"><AlertTriangle className="w-4 h-4"/> Weak opening</span>
                  )}</div>
               </div>
               <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="text-sm text-[--color-text-dim] mb-2 font-mono">Pacing</div>
                  <div className="font-semibold">{result.hookAnalysis.pacing}</div>
               </div>
             </div>
             <p className="text-white/80 leading-relaxed italic border-l-2 border-[--color-neon-purple] pl-4">
               "{result.hookAnalysis.feedback}"
             </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-[--color-neon-green] font-bold mb-4 flex items-center gap-2"><CheckCircle2 className="w-5 h-5"/> Strengths</h3>
              <ul className="space-y-3">
                {result.strengths.map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm text-[--color-text-dim] leading-relaxed">
                    <span className="text-[--color-neon-green] font-mono mt-0.5">{(i+1).toString().padStart(2, '0')}</span> 
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-[--color-neon-red] font-bold mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> Weaknesses</h3>
              <ul className="space-y-3">
                {result.weaknesses.map((w, i) => (
                  <li key={i} className="flex gap-3 text-sm text-[--color-text-dim] leading-relaxed">
                    <span className="text-[--color-neon-red] font-mono mt-0.5">{(i+1).toString().padStart(2, '0')}</span> 
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl">
              <h3 className="font-bold text-xl mb-4">AI Improvement Suggestions</h3>
              <div className="space-y-4">
                {result.suggestions.map((s, i) => (
                  <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/5 flex gap-4">
                    <div className="bg-white/10 w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold shrink-0">{i+1}</div>
                    <p className="text-[--color-text-dim] leading-relaxed">{s}</p>
                  </div>
                ))}
              </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
