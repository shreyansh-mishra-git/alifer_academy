import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, Zap, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import denm5 from "@/assets/DENM UNIT 5.jpg";

interface PromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: () => void;
}

const PromotionModal = ({ isOpen, onClose, onRegister }: PromotionModalProps) => {
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 11, minutes: 45, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) return { ...prev, seconds: seconds - 1 };
        if (minutes > 0) return { ...prev, minutes: minutes - 1, seconds: 59 };
        if (hours > 0) return { ...prev, hours: hours - 1, minutes: 59, seconds: 59 };
        if (days > 0) return { ...prev, days: days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
          />

          {/* Modal Container - Stacked for Full Image Visibility */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-xl bg-zinc-950 rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-white/10"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-[60] w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
            >
              <X size={16} />
            </button>

            {/* Banner Image - FULL VIEW (No Cropping) */}
            <div className="w-full bg-black">
              <img
                src={denm5}
                alt="Promotion Banner"
                className="w-full h-auto block" // Removed object-cover/contain to let it show naturally
                style={{ maxHeight: '70vh' }}
              />
            </div>

            {/* Content Section (Stacked below image) */}
            <div className="p-5 md:p-6 text-white bg-zinc-900 border-t border-white/10 relative">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-tighter">
                    <Bell size={10} className="animate-pulse" /> Limited Time Offer
                  </div>

                  <h2 className="text-lg md:text-xl font-display font-bold leading-tight">
                    Broadcasting <span className="text-primary italic">Unit 5 Solution</span>
                  </h2>
                  <p className="text-xs text-white/60 mt-1 uppercase tracking-wider font-medium">Topic-wise Explanation • BRAHMASTRA 3.0</p>
                </div>

                {/* Timer - Compact */}
                <div className="bg-white/5 rounded-lg px-3 py-2 border border-white/5 flex items-center gap-3">
                  <div className="text-[9px] text-primary font-bold uppercase rotate-[-90deg] border-r border-primary/20 pr-2 leading-none">
                    Ends In
                  </div>
                  <div className="flex gap-2 text-sm font-mono font-bold text-white">
                    <div className="flex flex-col items-center">
                      <span>{String(timeLeft.days).padStart(2, '0')}</span>
                      <span className="text-[7px] text-white/30 uppercase">Days</span>
                    </div>
                    <span className="text-white/20">:</span>
                    <div className="flex flex-col items-center">
                      <span>{String(timeLeft.hours).padStart(2, '0')}</span>
                      <span className="text-[7px] text-white/30 uppercase">Hrs</span>
                    </div>
                    <span className="text-white/20">:</span>
                    <div className="flex flex-col items-center">
                      <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
                      <span className="text-[7px] text-white/30 uppercase">Min</span>
                    </div>
                    <span className="text-white/20">:</span>
                    <div className="flex flex-col items-center">
                      <span className="text-primary">{String(timeLeft.seconds).padStart(2, '0')}</span>
                      <span className="text-[7px] text-white/30 uppercase">Sec</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-col sm:flex-row gap-3 items-center">
                <Button
                  className="w-full sm:w-80 px-12 py-6 rounded-xl text-base font-bold gap-2 shadow-xl shadow-primary/30 group transition-all active:scale-95"
                  onClick={() => {
                    onClose();
                    onRegister();
                  }}
                >
                  Register Now <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>

                <p className="text-[9px] text-white/40 italic">
                  * Filling up fast! Join the successful batch today.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PromotionModal;
