import { motion } from "framer-motion";
import { Play } from "lucide-react";

const DemoVideoSection = () => (
  <section className="section-padding">
    <div className="container mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-primary text-sm font-medium tracking-wider uppercase">Demo Class</span>
        <h2 className="text-3xl md:text-4xl font-display font-bold mt-2 mb-4">
          Watch How <span className="gradient-text">We Teach</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-10">
          Experience our unique teaching methodology before enrolling
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden glass-card glow-border"
      >
        <div className="aspect-video">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/FJ4ltLZy3m4"
            title="Demo Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </motion.div>
    </div>
  </section>
);

export default DemoVideoSection;
