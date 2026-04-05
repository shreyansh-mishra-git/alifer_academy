import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  { name: "Priya Sharma", exam: "UPSC CSE 2024", rank: "AIR 45", text: "Alifer Sir's methodology made complex topics so simple. His guidance was instrumental in my success.", avatar: "PS" },
  { name: "Rahul Verma", exam: "NDA 2024", rank: "AIR 12", text: "The mock tests and personal mentoring helped me crack NDA in my first attempt. Truly grateful!", avatar: "RV" },
  { name: "Sneha Patel", exam: "GATE CSE 2024", rank: "AIR 78", text: "Structured content and doubt support made all the difference. Highly recommend Alifer Academy!", avatar: "SP" },
  { name: "Amit Kumar", exam: "SSC CGL 2024", rank: "Selected", text: "Affordable yet top-quality preparation. The crash course was exactly what I needed.", avatar: "AK" },
];

const counters = [
  { value: 100, suffix: "+", label: "Selections", color: "from-primary to-blue-500" },
  { value: 10000, suffix: "+", label: "Students", color: "from-secondary to-orange-500" },
  { value: 50, suffix: "+", label: "Courses", color: "from-accent to-purple-500" },
  { value: 95, suffix: "%", label: "Satisfaction", color: "from-emerald-400 to-teal-500" },
];

function AnimatedCounter({ value, suffix, color }: { value: number; suffix: string; color: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(value / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setCount(value); clearInterval(timer); }
      else setCount(start);
    }, 20);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <div ref={ref} className={`text-3xl md:text-4xl font-display font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
      {count.toLocaleString()}{suffix}
    </div>
  );
}

const SuccessStoriesSection = () => (
  <section id="success" className="section-padding relative overflow-hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <span className="text-primary text-sm font-medium tracking-wider uppercase">Success Stories</span>
        <h2 className="text-3xl md:text-4xl font-display font-bold mt-2 mb-4">
          Our Students, Our <span className="gradient-text-secondary">Pride</span>
        </h2>
      </motion.div>

      {/* Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {counters.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            className="glass-card p-6 text-center"
          >
            <AnimatedCounter value={c.value} suffix={c.suffix} color={c.color} />
            <div className="text-sm text-muted-foreground mt-1">{c.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Testimonials */}
      <div className="grid sm:grid-cols-2 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.3 } }}
            className="glass-card p-6 group"
          >
            <Quote className="h-8 w-8 text-primary/20 mb-3 group-hover:text-primary/40 transition-colors" />
            <p className="text-muted-foreground leading-relaxed mb-4 italic">"{t.text}"</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-primary-foreground">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-display font-semibold text-foreground text-sm">{t.name}</div>
                  <div className="text-xs text-primary">{t.exam} • {t.rank}</div>
                </div>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-secondary text-secondary" />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SuccessStoriesSection;
