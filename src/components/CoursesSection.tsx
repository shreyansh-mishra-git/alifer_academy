import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Users, ArrowRight, Star, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import CourseDetailModal from "@/components/CourseDetailModal";

const courses = [
  {
    title: "UPSC Foundation",
    category: "UPSC",
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
    title: "GATE CSE Mastery",
    category: "GATE",
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
    title: "SSC CGL Complete",
    category: "SSC",
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
    title: "UPSC Optional",
    category: "UPSC",
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
    title: "Defence OTA",
    category: "NDA",
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

const categoryMeta: Record<string, { gradient: string; badge: string; icon: string; accent: string }> = {
  UPSC: {
    gradient: "from-blue-600/80 via-indigo-700/80 to-purple-800/80",
    badge: "bg-blue-500/15 text-blue-400 border-blue-500/25",
    icon: "⚖️",
    accent: "#60a5fa",
  },
  NDA: {
    gradient: "from-orange-600/80 via-red-700/80 to-rose-800/80",
    badge: "bg-orange-500/15 text-orange-400 border-orange-500/25",
    icon: "🎖️",
    accent: "#fb923c",
  },
  GATE: {
    gradient: "from-emerald-600/80 via-teal-700/80 to-cyan-800/80",
    badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
    icon: "💻",
    accent: "#34d399",
  },
  SSC: {
    gradient: "from-violet-600/80 via-purple-700/80 to-fuchsia-800/80",
    badge: "bg-violet-500/15 text-violet-400 border-violet-500/25",
    icon: "📊",
    accent: "#a78bfa",
  },
};

const CoursesSection = () => {
  const [selectedCourse, setSelectedCourse] = useState<typeof courses[0] | null>(null);

  return (
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
          {courses.map((c, i) => {
            const meta = categoryMeta[c.category] ?? {
              gradient: "from-slate-600/80 to-gray-800/80",
              badge: "bg-muted text-muted-foreground border-border",
              icon: "📚",
              accent: "#94a3b8",
            };
            return (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -10, transition: { duration: 0.25 } }}
                className={`relative glass-card overflow-hidden group cursor-pointer transition-shadow duration-300 hover:shadow-2xl ${
                  c.popular ? "ring-1 ring-primary/30" : ""
                }`}
                onClick={() => setSelectedCourse(c)}
              >
                {/* Popular badge */}
                {c.popular && (
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-lg shadow-primary/30">
                    <Flame className="h-3 w-3" />
                    Popular
                  </div>
                )}

                {/* Thumbnail */}
                <div className={`relative h-40 bg-gradient-to-br ${meta.gradient} overflow-hidden`}>
                  {/* Grid lines */}
                  <div className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
                      backgroundSize: "30px 30px",
                    }}
                  />
                  {/* Glow blob */}
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-2xl opacity-40"
                    style={{ background: meta.accent }}
                  />
                  {/* Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span
                      whileHover={{ scale: 1.2, rotate: [0, -8, 8, 0] }}
                      transition={{ duration: 0.4 }}
                      className="text-5xl drop-shadow-lg filter"
                    >
                      {meta.icon}
                    </motion.span>
                  </div>
                  {/* Category label */}
                  <div className="absolute bottom-3 left-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${meta.badge}`}>
                      {c.category}
                    </span>
                  </div>
                  {/* Hover shimmer */}
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
                </div>

                {/* Body */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="text-base font-display font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                      {c.title}
                    </h3>
                    <div className="text-right flex-shrink-0">
                      <span className="text-lg font-display font-bold" style={{ color: meta.accent }}>
                        {c.price}
                      </span>
                      <span className="block text-xs text-muted-foreground line-through">{c.originalPrice}</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2">{c.desc}</p>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />{c.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />{c.students}
                    </span>
                    <span className="flex items-center gap-1 ml-auto text-yellow-500">
                      <Star className="h-3 w-3 fill-yellow-500" />4.8
                    </span>
                  </div>

                  <div className="h-px bg-border/30 mb-4" />

                  <Button
                    className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                    style={{ background: `${meta.accent}15`, color: meta.accent }}
                    onClick={(e) => { e.stopPropagation(); setSelectedCourse(c); }}
                  >
                    Enroll Now
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>

                {/* Bottom glow on hover */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
