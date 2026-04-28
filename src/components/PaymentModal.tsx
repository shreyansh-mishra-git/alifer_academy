import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode, CheckCircle, Clock, AlertCircle, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiRequestPayment } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
  originalPrice: number;
  onSuccess?: () => void;
}

const QR_IMAGE_URL = 'https://placehold.co/200x200?text=Dummy+QR+Code';

const PaymentModal = ({
  open, onClose, courseId, courseTitle, originalPrice, onSuccess
}: PaymentModalProps) => {
  const finalPrice = 9; 
  const { refreshUser } = useAuth();
  const [showPayment, setShowPayment] = useState(true); 
  const [step, setStep] = useState<'qr' | 'verify' | 'done'>('qr');
  const [utr, setUtr] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const UPI_ID = 'aliferacademy@upi'; 

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleIPaid = async () => {
    setLoading(true);
    try {
      await apiRequestPayment(courseId, utr);
      await refreshUser();
      setStep('done');
      onSuccess?.();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit payment request');
    } finally {
      setLoading(false);
    }
  };

  const discount = Math.round((1 - finalPrice / originalPrice) * 100);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </button>

            {step === 'qr' && (
              <div className="text-center">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <QrCode className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold font-display">Scan & Pay</h3>
                  <p className="text-muted-foreground text-xs mt-1">{courseTitle}</p>
                </div>

                {/* Price */}
                <div className="flex items-center justify-center gap-3 mb-6 bg-primary/5 py-4 rounded-2xl border border-primary/10">
                  <div className="text-center">
                    <span className="text-4xl font-bold text-primary">₹{finalPrice}</span>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Total Amount</p>
                  </div>
                  <div className="h-10 w-px bg-primary/20" />
                  <div className="text-left">
                    <span className="text-sm line-through text-muted-foreground block">₹{originalPrice}</span>
                    <span className="text-xs bg-green-500/15 text-green-400 px-2 py-0.5 rounded-full font-bold">
                      {discount}% OFF
                    </span>
                  </div>
                </div>

                {/* QR Code */}
                {showPayment && (
                  <div className="bg-white rounded-2xl p-4 mx-auto w-fit mb-6 shadow-xl border-4 border-white ring-1 ring-border/50">
                    <img
                      src={QR_IMAGE_URL}
                      alt="Payment QR"
                      className="w-44 h-44 object-contain rounded-lg"
                    />
                  </div>
                )}

                {/* UPI ID */}
                <div className="bg-muted/50 rounded-xl p-3 mb-4 flex items-center justify-between">
                  <span className="text-sm font-mono text-foreground">{UPI_ID}</span>
                  <button onClick={handleCopyUPI} className="text-primary hover:text-primary/80">
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>

                <p className="text-xs text-muted-foreground mb-4">
                  Scan dummy QR or pay to UPI ID above
                </p>

                <Button className="w-full py-6 font-bold text-lg" onClick={() => setStep('verify')}>
                  I Have Paid
                </Button>
              </div>
            )}

            {step === 'verify' && (
              <div className="text-center">
                <CheckCircle className="h-10 w-10 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold font-display mb-2">Confirm Payment</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Enter your UTR/Transaction ID for faster approval (optional)
                </p>
                <Input
                  placeholder="UTR / Transaction ID (optional)"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                  className="mb-4 bg-muted/50 border-border text-center"
                />
                <Button
                  className="w-full"
                  onClick={handleIPaid}
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Payment Request'}
                </Button>
                <button
                  onClick={() => setStep('qr')}
                  className="mt-3 text-sm text-muted-foreground hover:text-foreground underline"
                >
                  ← Back to QR
                </button>
              </div>
            )}

            {step === 'done' && (
              <div className="text-center py-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <Clock className="h-14 w-14 text-yellow-400 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-xl font-bold font-display mb-2">Payment Submitted!</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Your payment request is being reviewed by the admin.
                  Once approved, all videos will unlock automatically.
                </p>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 mb-4 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-yellow-300 text-left">
                    Approval usually takes a few minutes. Check your dashboard for status updates.
                  </p>
                </div>
                <Button className="w-full" onClick={onClose}>
                  Got it!
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;
