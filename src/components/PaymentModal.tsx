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
  price: number;
  originalPrice: number;
  onSuccess?: () => void;
}

const QR_IMAGE_URL = '/payment-qr.jpg';

const PaymentModal = ({
  open, onClose, courseId, courseTitle, price: finalPrice, originalPrice, onSuccess
}: PaymentModalProps) => {
  const { refreshUser } = useAuth();
  const [showPayment, setShowPayment] = useState(true);
  const [step, setStep] = useState<'qr' | 'verify' | 'done'>('qr');
  const [utr, setUtr] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const UPI_ID = '9557370466@axl';
  const SUPPORT_NUMBER = '+91 97602 93095';

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
                <div className="mb-2">
                  <h3 className="text-xl font-bold font-display">Scan & Pay</h3>
                  <p className="text-muted-foreground text-[10px] mt-0.5">{courseTitle}</p>
                </div>

                {/* Price */}
                <div className="flex items-center justify-center gap-3 mb-3 bg-primary/5 py-2 rounded-2xl border border-primary/10">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-primary">₹{finalPrice}</span>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">Total Amount</p>
                  </div>
                  <div className="h-8 w-px bg-primary/20" />
                  <div className="text-left">
                    <span className="text-xs line-through text-muted-foreground block">₹{originalPrice}</span>
                    <span className="text-[10px] bg-green-500/15 text-green-400 px-1.5 py-0.5 rounded-full font-bold">
                      {discount}% OFF
                    </span>
                  </div>
                </div>

                {/* QR Code */}
                {showPayment && (
                  <div className="bg-white rounded-2xl p-1.5 mx-auto w-full max-w-[260px] mb-3 shadow-xl border-4 border-white ring-1 ring-border/50 overflow-hidden">
                    <img
                      src={QR_IMAGE_URL}
                      alt="Payment QR"
                      className="w-full h-auto object-contain rounded-lg block"
                    />
                  </div>
                )}

                {/* UPI ID */}
                <div className="bg-muted/50 rounded-xl p-2.5 mb-3 flex items-center justify-between">
                  <span className="text-sm font-mono text-foreground">{UPI_ID}</span>
                  <button onClick={handleCopyUPI} className="text-primary hover:text-primary/80">
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>

                <div className="space-y-1.5 mb-4 text-left">
                  <p className="text-[10px] text-primary font-medium flex items-start gap-1">
                    <span className="mt-0.5 font-bold">*</span>
                    <span>Send receipt/screenshot to: <strong>{SUPPORT_NUMBER}</strong></span>
                  </p>
                  <p className="text-[10px] text-amber-500 font-bold flex items-start gap-1 bg-amber-500/5 p-1.5 rounded-lg border border-amber-500/20">
                    <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Exact amount required for course unlock.</span>
                  </p>
                </div>

                <Button className="w-full py-5 font-bold text-base" onClick={() => setStep('verify')}>
                  I Have Paid
                </Button>
              </div>
            )}

            {step === 'verify' && (
              <div className="text-center">
                <CheckCircle className="h-10 w-10 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold font-display mb-2">Confirm Payment</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Enter your UTR/Transaction ID for faster approval (REQUIRED).
                </p>
                <p className="text-[10px] text-primary font-bold mb-4 bg-primary/5 p-2 rounded-lg border border-primary/20">
                  * Please send the receipt or a screenshot to: {SUPPORT_NUMBER}
                </p>
                <Input
                  placeholder="UTR / Transaction ID (REQUIRED)"
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
