import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Users, ArrowRight, Star, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import CourseDetailModal from "@/components/CourseDetailModal";

// Poster images from assets
import upsc2 from "@/assets/upsc2.jpg";
import nda2 from "@/assets/nda2.jpg";
import gate2 from "@/assets/gate2.jpg";
import poster7 from "@/assets/poster7.jpg";
import poster8 from "@/assets/poster8.jpg";
import poster9 from "@/assets/poster9.jpg";

const courses = [
  {
    title: "UPSC Foundation Course",
    category: "UPSC",
    image: upsc2,
    price: "₹4,999",
    originalPrice: "₹8,999",
    duration: "6 Months",
    students: "2.5K+",
    desc: "Complete prelims + mains preparation with current affairs coverage.",
    popular: true,
    validity: "Lifetime Access",
    language: "Hindi + English",
    type: "Recorded + Live",
  },
  {
    title: "NDA Crash Course",
    category: "NDA",
    image: nda2,
    price: "₹2,999",
    originalPrice: "₹5,499",
    duration: "3 Months",
    students: "1.8K+",
    desc: "Mathematics & GAT full syllabus with mock tests and analysis.",
    popular: false,
    validity: "1 Year",
    language: "Hindi",
    type: "Recorded",
  },
  {
    title: "GATE Course",
    category: "GATE",
    image: gate2,
    price: "₹5,499",
    originalPrice: "₹9,999",
    duration: "8 Months",
    students: "1.2K+",
    desc: "Complete Computer Science curriculum with previous year solutions.",
    popular: true,
    validity: "Lifetime Access",
    language: "English",
    type: "Recorded + Live",
  },
  {
    title: "SSC CGL Course",
    category: "SSC",
    image: poster7,
    price: "₹1,999",
    originalPrice: "₹3,999",
    duration: "4 Months",
    students: "3K+",
    desc: "Tier I & II complete preparation with quant, reasoning & English.",
    popular: false,
    validity: "1 Year",
    language: "Hindi + English",
    type: "Recorded",
  },
  {
    title: "UPSC Optional Course ",
    category: "UPSC",
    image: poster8,
    price: "₹3,499",
    originalPrice: "₹6,499",
    duration: "5 Months",
    students: "800+",
    desc: "In-depth optional subject preparation with answer writing practice.",
    popular: false,
    validity: "Lifetime Access",
    language: "Hindi + English",
    type: "Live",
  },
  {
    title: "Defence OTA Course",
    category: "NDA",
    image: poster9,
    price: "₹2,499",
    originalPrice: "₹4,499",
    duration: "2 Months",
    students: "950+",
    desc: "SSB interview prep and written exam strategies for defence exams.",
    popular: false,
    validity: "6 Months",
    language: "English",
    type: "Recorded",
  },
];

const categoryMeta: Record<string, { accent: string }> = {
  UPSC: { accent: "#60a5fa" },
  NDA: { accent: "#fb923c" },
  GATE: { accent: "#34d399" },
  SSC: { accent: "#a78bfa" },
};

const CoursesSection = () => {
  const [selectedCourse, setSelectedCourse] = useState<typeof courses[0] | null>(null);

  return (
    <section id="courses" className="section-padding relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((c, i) => {
            const meta = categoryMeta[c.category] ?? { accent: "#94a3b8" };
            
            return (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                className={`relative glass-card rounded-xl overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-2xl border border-border/30 hover:shadow-primary/20 ${
                  c.popular ? "ring-1 ring-primary/30" : ""
                }`}
                onClick={() => setSelectedCourse(c)}
              >
                {/* Popular badge */}
                {c.popular && (
                  <div className="absolute top-3 right-3 z-30 flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-lg shadow-primary/30">
                    <Flame className="h-3 w-3" />
                    Popular
                  </div>
                )}

                {/* Category label */}
                <div className="absolute top-3 left-3 z-30">
                  <span 
                    className="text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md"
                    style={{
                      background: `rgba(0,0,0,0.6)`,
                      color: meta.accent,
                      border: `1px solid ${meta.accent}40`,
                    }}
                  >
                    {c.category}
                  </span>
                </div>

                {/* Poster Thumbnail */}
                <div className="relative w-full">
                  <img
                    src={c.image}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  
                  {/* Overlay for readability - ~25% */}
                  <div className="absolute inset-0 bg-black/25 group-hover:bg-black/40 transition-colors duration-300 z-10 rounded-xl" />

                  {/* Hover "Enroll Now" Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <Button 
                      className="gap-2 font-semibold shadow-2xl scale-95 group-hover:scale-100 transition-transform duration-300"
                      style={{
                        background: meta.accent,
                        color: "#000",
                        boxShadow: `0 4px 20px ${meta.accent}60`,
                      }}
                      onClick={(e) => { e.stopPropagation(); setSelectedCourse(c); }}
                    >
                      Enroll Now
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-lg font-display font-bold text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-1">
                      {c.title}
                    </h3>
                    <div className="text-right flex-shrink-0">
                      <span className="text-lg font-display font-bold" style={{ color: meta.accent }}>
                        {c.price}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground mb-1">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />{c.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />{c.students}
                    </span>
                    <span className="flex items-center gap-1 text-yellow-500">
                      <Star className="h-3.5 w-3.5 fill-yellow-500" />4.8
                    </span>
                  </div>
                </div>
                
                {/* Bottom glow on hover */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: meta.accent }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <CourseDetailModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </section>
  );
};

export default CoursesSection;
