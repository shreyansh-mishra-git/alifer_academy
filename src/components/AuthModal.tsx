import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { apiLogin, apiSignup, apiVerifyOtp, apiResendOtp } from '@/lib/api';
import { toast } from 'sonner';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
}

const AuthModal = ({ open, onClose, defaultTab = 'login' }: AuthModalProps) => {
  const { login } = useAuth();
  const [tab, setTab] = useState<'login' | 'signup'>(defaultTab);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [step, setStep] = useState<'form' | 'otp'>('form');

  // Shared state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(0);

  // Signup-only state
  const [signupData, setSignupData] = useState({ name: '', phone: '' });

  const startTimer = () => {
    setTimer(60);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (tab === 'login') {
        if (!email || !password) return toast.error('Please fill all fields');
        const data = await apiLogin(email, password);
        
        login(data);
        toast.success(`Welcome back! 🎉`);
        onClose();
      } else {
        const { name, phone } = signupData;
        if (!name || !email || !phone || !password) return toast.error('All fields are required');
        
        const data = await apiSignup({ name, email, phone, password, age: 0 }); 
        
        login(data);
        toast.success('Account created! Welcome to Alifer Academy 🎉');
        onClose();
      }
    } catch (err: any) {
      toast.error(err.message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="relative glass-card p-8 w-full max-w-md glow-border rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors z-10"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-display font-bold gradient-text">
                {tab === 'login' ? 'Welcome Back 👋' : 'Join Alifer Academy 🎓'}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {tab === 'login'
                  ? 'Sign in to continue your learning journey'
                  : 'Create your account and start learning today'}
              </p>
            </div>

            {/* Tab switcher */}
            <div className="flex bg-muted/50 rounded-xl p-1 mb-6">
              {(['login', 'signup'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTab(t);
                  }}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    tab === t
                      ? 'bg-primary text-primary-foreground shadow'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t === 'login' ? 'Login' : 'Sign Up'}
                </button>
              ))}
            </div>

            {/* Forms */}
            <AnimatePresence mode="wait">
              <motion.form
                key={tab}
                initial={{ opacity: 0, x: tab === 'login' ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: tab === 'login' ? 20 : -20 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {tab === 'signup' && (
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Full Name"
                      value={signupData.name}
                      onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                      className="pl-9 bg-muted/50 border-border"
                    />
                  </div>
                )}

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 bg-muted/50 border-border"
                  />
                </div>

                {tab === 'signup' && (
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="tel"
                      placeholder="Phone number"
                      value={signupData.phone}
                      onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                      className="pl-9 bg-muted/50 border-border"
                    />
                  </div>
                )}

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-9 bg-muted/50 border-border"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full py-6 text-base font-bold gap-2 mt-2 shadow-lg hover:shadow-primary/20 transition-all"
                  disabled={loading}
                >
                  {loading ? (tab === 'login' ? 'Signing in...' : 'Creating account...') : (
                    <>
                      {tab === 'login' ? <Mail className="h-4 w-4" /> : <User className="h-4 w-4" />}
                      {tab === 'login' ? 'Sign In' : 'Create Account'}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </motion.form>
            </AnimatePresence>

            {/* Footer toggle */}
            <p className="text-xs text-muted-foreground mt-5 text-center">
              {tab === 'login' ? (
                <>Don't have an account?{' '}
                  <span onClick={() => setTab('signup')} className="text-primary cursor-pointer hover:underline font-medium">
                    Sign up free
                  </span>
                </>
              ) : (
                <>Already have an account?{' '}
                  <span onClick={() => setTab('login')} className="text-primary cursor-pointer hover:underline font-medium">
                    Login here
                  </span>
                </>
              )}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
