import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SignInModalProps {
  open: boolean;
  onClose: () => void;
}

const SignInModal = ({ open, onClose }: SignInModalProps) => (
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
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="relative glass-card p-8 w-full max-w-md glow-border"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
            <X size={20} />
          </button>

          <h2 className="text-2xl font-display font-bold gradient-text mb-2">Welcome Back</h2>
          <p className="text-muted-foreground mb-6">Sign in to continue your learning journey</p>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Email</label>
              <Input type="email" placeholder="you@example.com" className="bg-muted/50 border-border" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Password</label>
              <Input type="password" placeholder="••••••••" className="bg-muted/50 border-border" />
            </div>
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
              <Mail className="h-4 w-4" /> Sign in with Email
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs"><span className="bg-card px-2 text-muted-foreground">or</span></div>
            </div>

            <Button variant="outline" className="w-full border-border text-foreground hover:bg-muted gap-2">
              <Chrome className="h-4 w-4" /> Continue with Google
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-6 text-center">
            Don't have an account?{" "}
            <span className="text-primary cursor-pointer hover:underline">Sign up free</span>
          </p>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default SignInModal;
