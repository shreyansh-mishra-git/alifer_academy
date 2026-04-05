import { motion } from "framer-motion";
import { Zap, Target, BarChart3, Shield, Rocket, Award } from "lucide-react";

const features = [
  { icon: Zap, title: "Live Interactive Classes", desc: "Real-time sessions with Q&A", color: "from-primary/20 to-blue-500/20" },
  { icon: Target, title: "Exam-Focused Approach", desc: "Curriculum aligned to latest patterns", color: "from-secondary/20 to-orange-500/20" },
  { icon: BarChart3, title: "Performance Analytics", desc: "Track your progress in real-time", color: "from-accent/20 to-purple-500/20" },
  { icon: Shield, title: "Lifetime Access", desc: "Revisit content anytime, forever", color: "from-emerald-500/20 to-teal-500/20" },
  { icon: Rocket, title: "Fast-Track Batches", desc: "Intensive short-term programs", color: "from-primary/20 to-cyan-500/20" },
  { icon: Award, title: "Certified Courses", desc: "Get recognized certificates on completion", color: "from-secondary/20 to-amber-500/20" },
];

const WhatMakesDifferentSection = () => (
  <section className="section-padding">
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <span className="text-primary text-sm font-medium tracking-wider uppercase">Our Edge</span>
        <h2 className="text-3xl md:text-4xl font-display font-bold mt-2 mb-4">
          What Makes Us <span className="gradient-text-accent">Different</span>
        </h2>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            className="flex items-start gap-4 glass-card p-5 group cursor-default"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className={`flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br ${f.color} flex items-center justify-center`}
            >
              <f.icon className="h-6 w-6 text-primary" />
            </motion.div>
            <div>
              <h3 className="font-display font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhatMakesDifferentSection;
