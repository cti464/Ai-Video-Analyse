import { motion } from 'motion/react';
import { X, Mail, Lock, Chrome } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-[#1C1D24] border border-white/10 rounded-3xl p-8 relative overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-[#8E9299] hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
        <p className="text-[#8E9299] mb-8">Sign in to track your viral score history.</p>

        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-[#8E9299] mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8E9299]" />
              <input 
                type="email" 
                placeholder="you@example.com" 
                className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-[#8E9299] focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#8E9299] mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8E9299]" />
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-[#8E9299] focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>
        </div>

        <button 
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-lg hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all cursor-pointer mb-4"
          onClick={() => {
            alert("Login flow initiated.");
            onClose();
          }}
        >
          Sign In
        </button>

        <div className="relative flex items-center py-4">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink-0 mx-4 text-[#8E9299] text-sm">Or continue with</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <button 
          className="w-full py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold flex items-center justify-center gap-3 hover:bg-white/10 transition-colors cursor-pointer"
          onClick={() => {
             alert("Google Auth initiated.");
             onClose();
          }}
        >
          <Chrome className="w-5 h-5" />
          Google
        </button>
      </motion.div>
    </div>
  );
}
