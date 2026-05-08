import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

import nda from "@/assets/nda.jpg";
import upsc from "@/assets/upsc.jpg";
import denm1 from "@/assets/DENM UNIT 1.jpg";
import denm2 from "@/assets/DENM UNIT 2.jpg";
import denm3 from "@/assets/DENM UNIT 3.jpg";
import denm4 from "@/assets/DENM UNIT 4.jpg";
import denm5 from "@/assets/DENM UNIT 5.jpg";

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
    exam: "UNIT 1",
    title: "Unit 1 - ARJUNA 3.0",
    subtitle: "Topic-wise Explanation • ARJUNA 3.0",
    tag: "🏗️ Building Foundations",
    cta: "Join ARJUNA 3.0",
    gradient: "from-blue-900 via-indigo-900 to-purple-900",
    accentColor: "#60a5fa",
    icon: "📖",
    features: ["Step-by-step Solutions", "Detailed Concept Notes", "Unit-wise Practice Tests"],
    image: denm1,
  },
  {
    id: 2,
    exam: "UNIT 2",
    title: "Unit 2 - VAJRA 2.0",
    subtitle: "In-depth video solutions and practice material for Unit 2 modules",
    tag: "📚 Academic Excellence",
    cta: "Join Unit 2",
    gradient: "from-slate-900 via-gray-900 to-black",
    accentColor: "#fbbf24",
    icon: "🌟",
    features: ["Expert Faculty Support", "Interactive Live Classes", "Premium Study Material"],
    image: denm2,
  },
  {
    id: 3,
    exam: "UNIT 3",
    title: "Unit 3 - DRONA 3.0",
    subtitle: "Master Unit 3 concepts with our premium curriculum",
    tag: "🎯 Target Achieved",
    cta: "Join DRONA 3.0",
    gradient: "from-emerald-900 via-green-900 to-teal-900",
    accentColor: "#34d399",
    icon: "🔭",
    features: ["Advanced Topic Coverage", "Mock Test Series", "PDF Resource Library"],
    image: denm3,
  },
  {
    id: 4,
    exam: "UNIT 4",
    title: "Unit 4 - AGNI 2.0",
    subtitle: "Complete video solutions for Unit 4 academic modules",
    tag: "⚡ High Velocity",
    cta: "Join Unit 4",
    gradient: "from-amber-900 via-orange-900 to-yellow-900",
    accentColor: "#fbbf24",
    icon: "🏗️",
    features: ["Problem Solving Mastery", "Recorded Video Lectures", "Doubt Clearing Support"],
    image: denm4,
  },
  {
    id: 5,
    exam: "UNIT 5",
    title: "Unit 5 - BRAHMASTRA 2.0",
    subtitle: "The ultimate guide to acing Unit 5 topics",
    tag: "🚀 Fast Track",
    cta: "Join Unit 5",
    gradient: "from-rose-900 via-red-900 to-orange-900",
    accentColor: "#f87171",
    icon: "🛸",
    features: ["Intensive Revision", "Previous Year Solutions", "Expert Faculty Mentoring"],
    image: denm5,
  },
  {
    id: 6,
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
    id: 7,
    exam: "UPSC",
    title: "UPSC Civil Services",
    subtitle: "Comprehensive GS + CSAT preparation with expert faculty",
    tag: "🏛️ Administration Prep",
    cta: "Explore UPSC",
    gradient: "from-emerald-900 via-teal-900 to-cyan-900",
    accentColor: "#34d399",
    icon: "🏛️",
    features: ["Answer Writing Practice", "Current Affairs Daily", "Personal Mentorship"],
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
    <section className="relative w-full h-[500px] md:h-[700px] lg:h-[800px] overflow-hidden bg-zinc-950">
      <AnimatePresence mode="wait">
        <motion.div
          key={`slide-${current}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full h-full flex items-center"
        >
          {/* 1. Background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`} />
          {/* Subtle pattern or noise overlay could go here */}

          {/* 2. Content Overlay */}
          <div className="absolute inset-0 z-10 flex items-center">
            <div className="container mx-auto px-4 md:px-8">
              <div className="grid md:grid-cols-2 gap-8 items-center h-full">
                {/* Left Side: Text Content */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-white pt-12 md:pt-0"
                >
                  {/* Tag */}
                  <div
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-sm font-medium"
                    style={{ background: `${slide.accentColor}25`, border: `1px solid ${slide.accentColor}50` }}
                  >
                    <span style={{ color: slide.accentColor }}>{slide.tag}</span>
                  </div>

                  {/* Exam badge */}
                  <div
                    className="text-xs font-bold tracking-[0.2em] uppercase mb-2 opacity-70"
                    style={{ color: slide.accentColor }}
                  >
                    {slide.exam} PREPARATION
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold leading-tight mb-4">
                    {slide.title}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-base sm:text-lg text-white/80 mb-6 max-w-md leading-relaxed">
                    {slide.subtitle}
                  </p>

                  {/* Features */}
                  <div className="flex flex-col gap-2 mb-8 hidden sm:flex">
                    {slide.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-white/70">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: slide.accentColor }} />
                        {f}
                      </div>
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                    <Button
                      size="lg"
                      onClick={onEnroll}
                      className="gap-2 font-semibold px-8 py-6 rounded-xl text-base shadow-2xl group"
                      style={{ background: slide.accentColor, color: "#000" }}
                    >
                      {slide.cta}
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </motion.div>

                {/* Right Side: Image or Icon */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex items-center justify-center relative h-[300px] sm:h-[400px] md:h-[550px]"
                >
                  {slide.image ? (
                    <img 
                      src={slide.image} 
                      alt={slide.title}
                      className="max-h-full max-w-full object-contain rounded-xl drop-shadow-2xl border-4 border-white/10" 
                    />
                  ) : (
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
                      <div className="absolute -inset-4 rounded-3xl blur-2xl opacity-20" style={{ background: slide.accentColor }} />
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 3. Navigation Controls (Always absolute to the main section) */}
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
            className={`rounded-full transition-all duration-300 ${
              i === current ? "w-8 h-2.5" : "w-2.5 h-2.5 bg-white/30 hover:bg-white/50"
            }`}
            style={i === current ? { background: slide.accentColor } : {}}
          />
        ))}
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
