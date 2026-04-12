import { motion } from "framer-motion";
import upsc from "@/assets/upsc.jpg";
import nda from "@/assets/nda.jpg";
import gate from "@/assets/gate.jpg";

const insightPosters = [upsc, nda, gate];

const InfoSection = () => (
  <section id="insights" className="section-padding">
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

      <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-6 pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
        {insightPosters.map((poster, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex-shrink-0 w-[85%] md:w-auto snap-center"
          >
            <img
              src={poster}
              alt={`Insight ${i + 1}`}
              className="w-full h-56 object-cover rounded-xl shadow-md hover:scale-105 transition duration-300"
            />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default InfoSection;
