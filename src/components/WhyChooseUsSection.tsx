import { motion } from "framer-motion";
import { GraduationCap, IndianRupee, BrainCircuit, MessageCircleQuestion } from "lucide-react";

const items = [
  { icon: GraduationCap, title: "Expert Faculty", desc: "Learn from top educators with decades of exam preparation experience.", color: "text-primary", glow: "shadow-primary/20" },
  { icon: IndianRupee, title: "Affordable Pricing", desc: "Premium quality education at prices that won't break the bank.", color: "text-secondary", glow: "shadow-secondary/20" },
  { icon: BrainCircuit, title: "Smart Learning System", desc: "AI-powered adaptive learning that matches your pace and style.", color: "text-accent", glow: "shadow-accent/20" },
  { icon: MessageCircleQuestion, title: "Doubt Support", desc: "24/7 doubt resolution through our dedicated support team.", color: "text-emerald-400", glow: "shadow-emerald-400/20" },
];

const WhyChooseUsSection = () => (
  <section id="why-us" className="section-padding relative overflow-hidden">
    <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <span className="text-primary text-sm font-medium tracking-wider uppercase">Why Us</span>
        <h2 className="text-3xl md:text-4xl font-display font-bold mt-2 mb-4">
          Why Choose <span className="gradient-text">Alifer Academy</span>
        </h2>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className={`glass-card p-6 text-center group cursor-default transition-shadow duration-300 hover:shadow-xl ${item.glow}`}
          >
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
              className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-muted mb-4 ${item.color} group-hover:scale-110 transition-transform`}
            >
              <item.icon className="h-7 w-7" />
            </motion.div>
            <h3 className="font-display font-semibold mb-2 text-foreground">{item.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseUsSection;
