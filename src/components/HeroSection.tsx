import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

interface HeroProps {
  onExplore: () => void;
  onGetStarted: () => void;
}

const HeroSection = ({ onExplore, onGetStarted }: HeroProps) => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
    {/* Background */}
    <div className="absolute inset-0">
      <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
    </div>

    {/* Animated mesh gradient blobs */}
    <motion.div
      animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0] }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
    />
    <motion.div
      animate={{ x: [0, -30, 20, 0], y: [0, 20, -30, 0] }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
    />
    <motion.div
      animate={{ x: [0, 20, -10, 0], y: [0, -30, 10, 0] }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-1/2 right-1/3 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"
    />

    {/* Particle dots */}
    {Array.from({ length: 20 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-primary/30 rounded-full"
        style={{
          top: `${10 + Math.random() * 80}%`,
          left: `${10 + Math.random() * 80}%`,
        }}
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
        transition={{
          duration: 3 + Math.random() * 4,
          repeat: Infinity,
          delay: Math.random() * 3,
        }}
      />
    ))}

    <div className="relative z-10 container mx-auto px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm mb-8"
      >
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="text-sm text-primary font-medium">India's Smartest Learning Platform</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-4xl sm:text-5xl md:text-7xl font-display font-bold leading-tight mb-6"
      >
        Learn Smarter,{" "}
        <span className="gradient-text relative">
          Achieve Bigger
          <motion.span
            className="absolute -bottom-2 left-0 w-full h-1 rounded-full"
            style={{ background: "var(--gradient-primary)" }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          />
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
      >
        Master UPSC, NDA, GATE & more with expert guidance from Alifer Sir.
        Join thousands of successful students today.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <Button
          size="lg"
          onClick={onExplore}
          className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8 py-6 rounded-xl gap-2 group shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
        >
          Explore Courses
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={onGetStarted}
          className="border-border/50 text-foreground hover:bg-muted/50 backdrop-blur-sm text-base px-8 py-6 rounded-xl hover:border-primary/30 transition-all"
        >
          Get Started Free
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.0 }}
        className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
      >
        {[
          { value: "10K+", label: "Students" },
          { value: "50+", label: "Courses" },
          { value: "100+", label: "Selections" },
          { value: "4.9★", label: "Rating" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            whileHover={{ scale: 1.05 }}
            className="text-center p-4 rounded-xl bg-card/30 backdrop-blur-sm border border-border/20"
          >
            <div className="text-2xl md:text-3xl font-display font-bold gradient-text">{s.value}</div>
            <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>

    {/* Scroll indicator */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2"
    >
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="h-6 w-6 text-muted-foreground/50" />
      </motion.div>
    </motion.div>
  </section>
);

export default HeroSection;
