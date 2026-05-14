import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { extractFrames } from './lib/video-utils';
import { analyzeVideoFrames, type VideoAnalysisResult } from './lib/gemini';
import UploadSection from './components/UploadSection';
import ResultsDashboard from './components/ResultsDashboard';
import LoginModal from './components/LoginModal';
import PricingModal from './components/PricingModal';
import { Fingerprint, Play, ChevronLeft } from 'lucide-react';

export default function App() {
  const [analysisResult, setAnalysisResult] = useState<VideoAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [analyzeCount, setAnalyzeCount] = useState(() => {
    const saved = localStorage.getItem('analyzeCount');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isPro, setIsPro] = useState(() => {
    return localStorage.getItem('isPro') === 'true';
  });

  const MAX_FREE_ANALYSES = 3;

  const handleAnalyze = async (file: File) => {
    if (!isPro && analyzeCount >= MAX_FREE_ANALYSES) {
      setIsPricingModalOpen(true);
      return;
    }

    try {
      setIsAnalyzing(true);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      
      const frames = await extractFrames(file, 4);
      if (frames.length === 0) {
        throw new Error("Could not extract frames. Please ensure it's a valid video format.");
      }
      
      const result = await analyzeVideoFrames(frames);
      setAnalysisResult(result);
      
      const newCount = analyzeCount + 1;
      setAnalyzeCount(newCount);
      localStorage.setItem('analyzeCount', newCount.toString());
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setAnalysisResult(null);
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
      setVideoUrl(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pt-12 pb-24 px-6 relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-500 opacity-20 blur-[150px]"></div>
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-purple-500 opacity-10 blur-[150px]"></div>
      </div>

      {/* Header */}
      <header className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 z-10 mb-12 sm:mb-16">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-[#1C1D24] border border-white/10 rounded-xl relative overflow-hidden group cursor-pointer" onClick={reset}>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <Play className="w-6 h-6 text-white" fill="currentColor" />
           </div>
           <h1 className="text-2xl font-bold tracking-tight cursor-pointer" onClick={reset}>EditScore <span className="font-mono text-xs uppercase tracking-widest text-blue-500 border border-blue-500/30 px-2 py-0.5 rounded-full ml-1">AI</span></h1>
        </div>
        
        <div className="flex items-center gap-6 text-sm font-medium text-[#8E9299]">
           <button onClick={() => alert("Scroll to How it works section...")} className="hover:text-white transition-colors cursor-pointer hidden sm:block">How it works</button>
           <button onClick={() => setIsPricingModalOpen(true)} className="hover:text-white transition-colors cursor-pointer">Pricing</button>
           <button onClick={() => setIsLoginModalOpen(true)} className="px-5 py-2.5 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-colors cursor-pointer">Log in</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full flex flex-col items-center justify-center z-10">
        <AnimatePresence mode="wait">
          {!analysisResult ? (
            <motion.div 
              key="hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-4xl text-center flex flex-col items-center cursor-default"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono mb-8 uppercase tracking-widest text-[#8E9299]">
                 <Fingerprint className="w-4 h-4 text-purple-500" />
                 AI analyzing your edit
              </div>
              
              <h1 className="font-sans font-bold text-5xl md:text-7xl leading-tight tracking-tight mb-6">
                Know exactly why <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500">your videos fail.</span>
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl text-[#8E9299] max-w-2xl mb-12 px-4 sm:px-0">
                Upload your reel or TikTok. Our AI acts as a brutal creative director—analyzing your hook, pacing, and color grading to predict viral potential.
              </p>

              <UploadSection onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} analyzeCount={analyzeCount} maxFree={MAX_FREE_ANALYSES} isPro={isPro} />
              
            </motion.div>
          ) : (
             <motion.div 
               key="dashboard"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="w-full"
             >
                <div className="w-full max-w-6xl mx-auto mb-8">
                  <button 
                    onClick={reset}
                    className="flex items-center gap-2 text-[#8E9299] hover:text-white font-medium transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Analyze Another Video
                  </button>
                </div>
                <ResultsDashboard result={analysisResult} videoUrl={videoUrl!} />
             </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isPricingModalOpen && (
          <PricingModal isOpen={isPricingModalOpen} onClose={() => setIsPricingModalOpen(false)} onUpgrade={() => { setIsPro(true); localStorage.setItem('isPro', 'true'); }} />
        )}
      </AnimatePresence>
    </div>
  );
}
