import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import denm1 from "@/assets/DENM UNIT 1.jpg";


interface PosterItem {
  title: string;
  subtitle: string;
  gradient?: string;
  image?: string;
}

const posters: PosterItem[] = [
  { title: "UPSC 2025 Batch Open", subtitle: "Early bird discount - 30% off!", gradient: "from-primary/20 to-blue-600/20" },
  { title: "NDA Crash Course", subtitle: "Start your defence journey today", gradient: "from-secondary/20 to-orange-600/20" },
  { title: "Free GATE Webinar", subtitle: "This Saturday at 7PM", gradient: "from-accent/20 to-purple-600/20" },
  { title: "Scholarship Test", subtitle: "Win up to 100% fee waiver", gradient: "from-emerald-500/20 to-teal-600/20" },
  { title: "Unit 2 Batch 3.0", subtitle: "Coming Soon", gradient: "from-blue-600/20 to-indigo-900/20" },
  { title: "Unit 4 Batch 3.0", subtitle: "Coming Soon", gradient: "from-orange-600/20 to-amber-900/20" },
  { title: "Unit 5 Batch 3.0", subtitle: "Coming Soon", gradient: "from-red-600/20 to-rose-900/20" },
];


const PostersCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((p) => (p + 1) % posters.length), 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="section-padding">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-primary text-sm font-medium tracking-wider uppercase">Latest Updates</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-2">
            What's <span className="gradient-text">New</span>
          </h2>
        </motion.div>

        <div className="relative max-w-3xl mx-auto">
          <div className="overflow-hidden rounded-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -80 }}
                transition={{ duration: 0.4 }}
                className={`glass-card aspect-[2/1] flex flex-col items-center justify-center text-center p-8 overflow-hidden relative ${!posters[current].image ? `bg-gradient-to-br ${posters[current].gradient}` : 'bg-black'}`}
              >
                {posters[current].image && (
                  <>
                    <img 
                      src={posters[current].image} 
                      alt={posters[current].title}
                      className="absolute inset-0 w-full h-full object-cover opacity-60" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  </>
                )}
                <div className="relative z-10">
                  {posters[current].subtitle === "Coming Soon" && (
                    <div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/50 text-yellow-300 text-xs font-bold px-4 py-1 rounded-full mb-3 animate-pulse">
                      🚀 COMING SOON
                    </div>
                  )}
                  <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-2 drop-shadow-lg">{posters[current].title}</h3>
                  <p className="text-white/80 drop-shadow-md">{posters[current].subtitle}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            onClick={() => setCurrent((p) => (p - 1 + posters.length) % posters.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur flex items-center justify-center text-foreground hover:bg-card transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setCurrent((p) => (p + 1) % posters.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur flex items-center justify-center text-foreground hover:bg-card transition-colors"
          >
            <ChevronRight size={20} />
          </button>

          <div className="flex justify-center gap-2 mt-4">
            {posters.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-primary w-6" : "bg-muted-foreground/30"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PostersCarousel;
