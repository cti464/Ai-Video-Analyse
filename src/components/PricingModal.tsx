import { motion } from 'motion/react';
import { X, Check } from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export default function PricingModal({ isOpen, onClose, onUpgrade }: PricingModalProps) {
  if (!isOpen) return null;

  const handleUpgrade = () => {
    const link = document.createElement('a');
    link.href = 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80'; // Bicycle image
    
    // Some browsers block cross-origin downloads and just open them in a new tab. 
    // To attempt a direct download, we fetch it as a blob first.
    fetch(link.href)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pro-bonus-bicycle.jpg';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        alert('Thank you for upgrading to Pro! Enjoy your premium photo.');
        onUpgrade();
        onClose();
      })
      .catch(error => {
        console.error('Download failed', error);
        // Fallback
        link.target = "_blank";
        link.click();
        onUpgrade();
        onClose();
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto pt-24 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-[#1C1D24] border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-[#8E9299] hover:text-white transition-colors cursor-pointer z-10"
        >
          <X className="w-8 h-8" />
        </button>

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Simple, transparent pricing</h2>
          <p className="text-xl text-[#8E9299] max-w-2xl mx-auto">Upload more videos, get more insights, go viral faster.</p>
        </div>

        <div className="max-w-md mx-auto">
          {/* Pro Tier */}
          <div className="bg-gradient-to-b from-[#1C1D24] to-black/30 border border-purple-500 rounded-3xl p-8 flex flex-col relative shadow-[0_0_30px_rgba(139,92,246,0.15)] mt-4 md:mt-0">
            <h3 className="text-2xl font-bold mb-2">Viral Pro</h3>
            <div className="text-4xl font-bold mb-6">₹149<span className="text-lg text-[#8E9299] font-normal">/mo</span></div>
            <p className="text-[#8E9299] mb-8">For serious creators who want an edge in the algorithm.</p>
            
            <ul className="space-y-4 mb-8 flex-1">
              {['Unlimited video analyses', 'Deep-dive hook feedback', 'Fast priority processing', 'Trend prediction scores', 'Shareable report cards'].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-purple-500" />
                  <span className="text-sm font-medium">{feature}</span>
                </li>
              ))}
            </ul>
            
            <button className="w-full py-3 rounded-xl bg-purple-500 text-white font-semibold hover:bg-purple-600 transition-colors cursor-pointer shadow-lg shadow-purple-500/25" onClick={handleUpgrade}>Upgrade to Pro</button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
