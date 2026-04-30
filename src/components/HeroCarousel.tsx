import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import poster8 from "@/assets/poster8.jpg";

import { Button } from "@/components/ui/button";

interface Slide {
  id: number;
  exam: string;
  title: string;
  subtitle: string;
  tag: string;
  cta: string;
  gradient: string;
  accentColor: string;
  icon: string;
  features: string[];
  image?: string;
}

const slides: Slide[] = [
  {
    id: 1,
    exam: "New Batch",
    title: "Enrolling Now for 2025",
    subtitle: "Secure your future with Alifer Academy's premium coaching",
    tag: "✨ New Arrival",
    cta: "Join Now",
    gradient: "from-slate-900 via-gray-900 to-black",
    accentColor: "#fbbf24",
    icon: "🌟",
    features: ["Expert Faculty Support", "Interactive Live Classes", "Premium Study Material"],
    image: poster8,
  },
  {
    id: 2,
    exam: "NDA",
    title: "NDA Crash Course",
    subtitle: "Crack NDA in 90 days with focused Maths & GAT preparation",
    tag: "🎯 High Success Rate",
    cta: "Enroll Now",
    gradient: "from-orange-900 via-red-900 to-rose-900",
    accentColor: "#fb923c",
    icon: "🎖️",
    features: ["Maths + GAT Full Syllabus", "SSB Interview Prep", "Previous Year Papers"],
  },
  {
    id: 3,
    exam: "GATE",
    title: "GATE CSE Mastery",
    subtitle: "Ace GATE with comprehensive CS curriculum and expert mentoring",
    tag: "🚀 Top Rankers Batch",
    cta: "Explore Course",
    gradient: "from-emerald-900 via-teal-900 to-cyan-900",
    accentColor: "#34d399",
    icon: "💻",
    features: ["All CSE Topics Covered", "10,000+ Practice Problems", "Live Doubt Sessions"],
  },
  {
    id: 4,
    exam: "SSC",
    title: "SSC CGL Complete",
    subtitle: "Complete Tier I & II preparation with quantitative mastery",
    tag: "⚡ Fast-Track Available",
    cta: "Enroll Now",
    gradient: "from-violet-900 via-purple-900 to-fuchsia-900",
    accentColor: "#a78bfa",
    icon: "📊",
    features: ["Quant + Reasoning + English", "Tier I & II Coverage", "Weekly Mock Tests"],
  },
  {
    id: 5,
    exam: "Defence",
    title: "Defence OTA Special",
    subtitle: "All-in-one preparation for NDA, OTA, AFCAT exams",
    tag: "🛡️ Defence Specialist",
    cta: "Explore Course",
    gradient: "from-sky-900 via-blue-900 to-indigo-900",
    accentColor: "#38bdf8",
    icon: "✈️",
    features: ["Written Exam Strategy", "Physical Fitness Guide", "SSB GD & Interview"],
  },
  {
    id: 6,
    exam: "UNIT 2",
    title: "Unit 2 Mastery",
    subtitle: "In-depth video solutions and practice material for Unit 2 modules",
    tag: "📚 Academic Excellence",
    cta: "Join Unit 2",
    gradient: "from-blue-900 via-indigo-900 to-purple-900",
    accentColor: "#60a5fa",
    icon: "📖",
    features: ["Step-by-step Solutions", "Detailed Concept Notes", "Unit-wise Practice Tests"],
    image: poster8,
  },
  {
    id: 7,
    exam: "UNIT 1",
    title: "Unit 1 Solutions",
    subtitle: "Topic-wise Explanation • Pandava 3.0",
    tag: "⚡ High Velocity",
    cta: "Join Unit 1",
    gradient: "from-amber-900 via-orange-900 to-yellow-900",
    accentColor: "#fbbf24",
    icon: "🏗️",
    features: ["Problem Solving Mastery", "Recorded Video Lectures", "Doubt Clearing Support"],
    image: poster8,
  },
  {
    id: 8,
    exam: "UNIT 4",
    title: "Unit 4 Special",
    subtitle: "Master Unit 4 concepts with our premium curriculum",
    tag: "🎯 Target Achieved",
    cta: "Join Unit 4",
    gradient: "from-emerald-900 via-green-900 to-teal-900",
    accentColor: "#34d399",
    icon: "🔭",
    features: ["Advanced Topic Coverage", "Mock Test Series", "PDF Resource Library"],
    image: poster8,
  },
  {
    id: 9,
    exam: "UNIT 5",
    title: "Unit 5 Intensive",
    subtitle: "The ultimate guide to acing Unit 5 topics",
    tag: "🚀 Fast Track",
    cta: "Join Unit 5",
    gradient: "from-rose-900 via-red-900 to-orange-900",
    accentColor: "#f87171",
    icon: "🛸",
    features: ["Intensive Revision", "Previous Year Solutions", "Expert Faculty Mentoring"],
    image: poster8,
  },
];

const HeroCarousel = ({ onEnroll }: { onEnroll?: () => void }) => {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrent((p) => (p + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const goTo = (idx: number) => {
    setCurrent(idx);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const prev = () => goTo((current - 1 + slides.length) % slides.length);
  const next = () => goTo((current + 1) % slides.length);

  const slide = slides[current];

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: "580px", height: "92vh", maxHeight: "720px" }}>
      {/* Slide backgrounds */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`bg-${current}`}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 overflow-hidden"
        >
          {slide.image ? (
            <img 
              src={slide.image} 
              alt={slide.title}
              className="w-full h-full object-cover opacity-40 scale-110" 
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${slide.gradient}`} />
          )}
          {/* Default gradient overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Animated mesh overlay */}
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, ${slide.accentColor}40 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${slide.accentColor}30 0%, transparent 40%)`,
        }}
      />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating blobs - Hidden on mobile for performance */}
      <motion.div
        animate={{ x: [0, 30, -10, 0], y: [0, -20, 15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-20 hidden md:block"
        style={{ background: slide.accentColor }}
      />
      <motion.div
        animate={{ x: [0, -25, 20, 0], y: [0, 20, -25, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 left-1/3 w-48 h-48 rounded-full blur-3xl opacity-15 hidden md:block"
        style={{ background: slide.accentColor }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${current}`}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-white"
              >
                {/* Tag */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-sm font-medium"
                  style={{ background: `${slide.accentColor}25`, border: `1px solid ${slide.accentColor}50` }}
                >
                  <span style={{ color: slide.accentColor }}>{slide.tag}</span>
                </motion.div>

                {/* Exam badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                  className="text-xs font-bold tracking-[0.2em] uppercase mb-2 opacity-70"
                  style={{ color: slide.accentColor }}
                >
                  {slide.exam} PREPARATION
                </motion.div>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl sm:text-5xl md:text-6xl font-display font-bold leading-tight mb-4"
                >
                  {slide.title}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg text-white/80 mb-6 max-w-md leading-relaxed"
                >
                  {slide.subtitle}
                </motion.p>

                {/* Features */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col gap-2 mb-8"
                >
                  {slide.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-white/70">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: slide.accentColor }} />
                      {f}
                    </div>
                  ))}
                </motion.div>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col sm:flex-row flex-wrap gap-3"
                >
                  <Button
                    size="lg"
                    onClick={onEnroll}
                    className="gap-2 font-semibold px-8 py-6 rounded-xl text-base shadow-2xl group"
                    style={{ background: slide.accentColor, color: "#000" }}
                  >
                    {slide.cta}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    size="lg"
                    className="gap-2 px-8 py-6 rounded-xl text-base font-semibold text-white shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(12px)",
                      border: "2px solid rgba(255,255,255,0.5)",
                    }}
                    onClick={() => document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    View All Courses
                  </Button>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Right: Big icon / visual */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`icon-${current}`}
                initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.6, rotate: 10 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="hidden md:flex items-center justify-center"
              >
                <div className="relative">
                  <div
                    className="w-56 h-56 lg:w-72 lg:h-72 rounded-3xl flex items-center justify-center text-8xl lg:text-9xl shadow-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${slide.accentColor}20, ${slide.accentColor}08)`,
                      border: `2px solid ${slide.accentColor}30`,
                      backdropFilter: "blur(20px)",
                    }}
                  >
                    <motion.span
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {slide.icon}
                    </motion.span>
                  </div>
                  {/* Glow ring */}
                  <div
                    className="absolute -inset-4 rounded-3xl blur-2xl opacity-20"
                    style={{ background: slide.accentColor }}
                  />
                  {/* Corner badges */}
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    className="absolute -top-4 -right-4 px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-lg"
                    style={{ background: slide.accentColor }}
                  >
                    {slide.exam}
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    className="absolute -bottom-4 -left-4 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 backdrop-blur border border-white/20 text-white shadow-lg"
                  >
                    ✅ Alifer Academy
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current ? "w-8 h-2.5" : "w-2.5 h-2.5 bg-white/30 hover:bg-white/50"
            }`}
            style={i === current ? { background: slide.accentColor } : {}}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-8 right-6 z-20 text-white/40 text-sm font-display">
        {current + 1} / {slides.length}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 z-20">
        <motion.div
          key={`progress-${current}`}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 5, ease: "linear" }}
          className="h-full"
          style={{ background: slide.accentColor }}
        />
      </div>
    </section>
  );
};

export default HeroCarousel;
