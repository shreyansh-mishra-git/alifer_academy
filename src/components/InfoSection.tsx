import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const posts = [
  { title: "How to Start UPSC Preparation in 2025", date: "March 15, 2025", author: "Alifer Sir", preview: "A comprehensive guide for beginners looking to crack the civil services examination..." },
  { title: "NDA Study Plan: 90 Days Strategy", date: "Feb 28, 2025", author: "Alifer Sir", preview: "Follow this structured 90-day plan to maximize your NDA preparation efficiency..." },
  { title: "GATE CSE: Top Resources & Tips", date: "Jan 20, 2025", author: "Alifer Sir", preview: "Curated list of the best resources and preparation strategies for GATE Computer Science..." },
];

const InfoSection = () => (
  <section className="section-padding">
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <span className="text-primary text-sm font-medium tracking-wider uppercase">Information</span>
        <h2 className="text-3xl md:text-4xl font-display font-bold mt-2 mb-4">
          Insights from <span className="gradient-text">Alifer Sir</span>
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {posts.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card overflow-hidden hover-lift group"
          >
            <div className="h-40 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-primary/40 group-hover:scale-110 transition-transform" />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{p.date}</span>
                <span className="flex items-center gap-1"><User className="h-3 w-3" />{p.author}</span>
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2 line-clamp-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{p.preview}</p>
              <Button variant="ghost" className="text-primary hover:text-primary/80 p-0 h-auto gap-1 text-sm">
                Read More <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default InfoSection;
