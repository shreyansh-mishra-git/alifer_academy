import { motion } from "framer-motion";
import { Clock, Users, ArrowRight, Star, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

const courses = [
  { title: "UPSC Foundation", category: "UPSC", price: "₹4,999", originalPrice: "₹8,999", duration: "6 Months", students: "2.5K+", desc: "Complete prelims + mains preparation with current affairs coverage.", popular: true },
  { title: "NDA Crash Course", category: "NDA", price: "₹2,999", originalPrice: "₹5,499", duration: "3 Months", students: "1.8K+", desc: "Mathematics & GAT full syllabus with mock tests and analysis.", popular: false },
  { title: "GATE CSE Mastery", category: "GATE", price: "₹5,499", originalPrice: "₹9,999", duration: "8 Months", students: "1.2K+", desc: "Complete Computer Science curriculum with previous year solutions.", popular: true },
  { title: "SSC CGL Complete", category: "SSC", price: "₹1,999", originalPrice: "₹3,999", duration: "4 Months", students: "3K+", desc: "Tier I & II complete preparation with quant, reasoning & English.", popular: false },
  { title: "UPSC Optional", category: "UPSC", price: "₹3,499", originalPrice: "₹6,499", duration: "5 Months", students: "800+", desc: "In-depth optional subject preparation with answer writing practice.", popular: false },
  { title: "Defence OTA", category: "NDA", price: "₹2,499", originalPrice: "₹4,499", duration: "2 Months", students: "950+", desc: "SSB interview prep and written exam strategies for defence exams.", popular: false },
];

const categoryColors: Record<string, string> = {
  UPSC: "bg-primary/10 text-primary border-primary/20",
  NDA: "bg-secondary/10 text-secondary border-secondary/20",
  GATE: "bg-accent/10 text-accent border-accent/20",
  SSC: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

const CoursesSection = () => (
  <section id="courses" className="section-padding relative overflow-hidden">
    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
    <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <span className="text-primary text-sm font-medium tracking-wider uppercase">Our Courses</span>
        <h2 className="text-3xl md:text-4xl font-display font-bold mt-2 mb-4">
          Choose Your <span className="gradient-text">Path to Success</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Comprehensive courses designed by experts for every competitive exam
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className={`relative glass-card p-6 group cursor-pointer transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/10 ${
              c.popular ? "border-primary/30" : ""
            }`}
          >
            {/* Popular badge */}
            {c.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-lg shadow-primary/30">
                <Flame className="h-3 w-3" />
                Popular
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <span className={`text-xs font-medium px-3 py-1 rounded-full border ${categoryColors[c.category] ?? "bg-muted text-muted-foreground"}`}>
                {c.category}
              </span>
              <div className="text-right">
                <span className="text-xl font-display font-bold gradient-text-secondary">{c.price}</span>
                <span className="block text-xs text-muted-foreground line-through">{c.originalPrice}</span>
              </div>
            </div>

            <h3 className="text-lg font-display font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
              {c.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{c.desc}</p>

            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{c.duration}</span>
              <span className="flex items-center gap-1"><Users className="h-3 w-3" />{c.students}</span>
              <span className="flex items-center gap-1 ml-auto text-secondary"><Star className="h-3 w-3 fill-secondary" />4.8</span>
            </div>

            <div className="h-px bg-border/30 my-4" />

            <Button className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all gap-2 group-hover:bg-primary group-hover:text-primary-foreground">
              Enroll Now <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default CoursesSection;
