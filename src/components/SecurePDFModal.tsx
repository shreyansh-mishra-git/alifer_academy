import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Minimize2, ZoomIn, ZoomOut, AlertTriangle, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface SecurePDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  pdfTitle: string;
}

const SecurePDFModal = ({ isOpen, onClose, pdfUrl, pdfTitle }: SecurePDFModalProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Disable Right Click, Print, Save, and DevTools
  useEffect(() => {
    if (!isOpen) return;

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      toast.error('Right-click is disabled for security');
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable:
      // Ctrl+S (Save), Ctrl+P (Print), Ctrl+U (Source), Ctrl+Shift+I/J/C (DevTools)
      // Ctrl+A (Select All), Ctrl+C (Copy), Ctrl+Shift+S (Snippet)
      // F12 (DevTools), PrintScreen
      const forbiddenKeys = ['s', 'p', 'u', 'i', 'j', 'c', 'a'];
      const isForbidden = (e.ctrlKey || e.metaKey) && forbiddenKeys.includes(e.key.toLowerCase());
      const isDevTools = (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) || e.key === 'F12';
      
      if (isForbidden || isDevTools || e.key === 'PrintScreen') {
        e.preventDefault();
        toast.error('This action is disabled for security');
        return false;
      }
    };

    // Print deterrent
    const style = document.createElement('style');
    style.id = 'print-deterrent';
    style.innerHTML = `
      @media print {
        body { display: none !important; }
      }
    `;
    document.head.appendChild(style);

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
      const s = document.getElementById('print-deterrent');
      if (s) s.remove();
    };
  }, [isOpen]);

  const toggleFullscreen = () => {
    const el = document.getElementById('pdf-viewer-container');
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const getEmbedUrl = (url: string) => {
    if (url.includes('drive.google.com/file/d/')) {
      const id = url.split('/d/')[1]?.split('/')[0];
      return `https://drive.google.com/file/d/${id}/preview`;
    }
    return url;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-zinc-950/95 backdrop-blur-2xl overflow-hidden select-none"
          onContextMenu={(e) => e.preventDefault()}
        >
          <motion.div
            id="pdf-viewer-container"
            initial={{ scale: 0.98, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.98, opacity: 0, y: 30 }}
            className="relative w-full h-full max-w-5xl max-h-[90vh] mx-auto overflow-hidden rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.8)] bg-white border border-white/10 mt-16 group flex flex-col"
          >
            {/* Top Control Bar - Moved INSIDE for Fullscreen support */}
            <div className="w-full p-4 flex items-center justify-between z-[220] bg-zinc-900 border-b border-white/5 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                  <Shield size={20} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm md:text-base truncate max-w-[150px] md:max-w-md">
                    {pdfTitle}
                  </h3>
                  <p className="text-primary/60 text-[10px] uppercase tracking-[0.2em] font-black">Secure Learning Environment</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-white/10 flex gap-2"
                >
                  {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  <span className="text-xs hidden md:inline">{isFullscreen ? 'Exit Full' : 'Full Screen'}</span>
                </Button>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-500 border border-red-500/20 transition-all hover:scale-110"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 z-[230]">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6" />
                <p className="text-primary text-sm font-bold animate-pulse tracking-[0.3em] uppercase">Securing Connection...</p>
              </div>
            )}

            {/* Watermark Overlay (Repeated) */}
            <div className="absolute inset-0 z-[210] pointer-events-none opacity-[0.03] flex flex-wrap gap-20 p-20 overflow-hidden rotate-[-25deg] select-none">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="text-4xl font-black text-black whitespace-nowrap">ALIFER ACADEMY SECURE</div>
              ))}
            </div>

            {/* The Iframe */}
            <iframe
              src={getEmbedUrl(pdfUrl)}
              className="w-full h-full border-none bg-white"
              onLoad={() => setLoading(false)}
              title={pdfTitle}
              allowFullScreen
            />
            
            {/* 
              Strict Interaction Blockers 
              Covering the common areas for 'Download', 'Share', or 'Pop-out' buttons in viewers
            */}
            {/* Top right corner blocker - Larger area for pop-out button */}
            <div className="absolute top-0 right-0 w-80 h-32 z-[215] bg-transparent pointer-events-auto" />
            {/* Top edge blocker - Covers the whole top toolbar area if it appears */}
            <div className="absolute top-0 left-0 w-full h-12 z-[215] bg-transparent pointer-events-auto" />
            <div className="absolute bottom-0 right-0 w-40 h-16 z-[215] bg-transparent pointer-events-auto" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SecurePDFModal;
