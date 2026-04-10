import { motion, AnimatePresence } from "framer-motion";
import {
  X, Clock, Users, Star, Flame, Lock, Play, FileText,
  Globe, BookOpen, Video, Download, CheckCircle, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Course {
  title: string;
  category: string;
  price: string;
  originalPrice: string;
  duration: string;
  students: string;
  desc: string;
  popular: boolean;
  validity?: string;
  language?: string;
  type?: string;
}

interface CourseDetailModalProps {
  course: Course | null;
  onClose: () => void;
}

const categoryGradients: Record<string, { bg: string; accent: string; icon: string }> = {
  UPSC: { bg: "from-blue-600 via-indigo-700 to-purple-800", accent: "#60a5fa", icon: "⚖️" },
  NDA: { bg: "from-orange-600 via-red-700 to-rose-800", accent: "#fb923c", icon: "🎖️" },
  GATE: { bg: "from-emerald-600 via-teal-700 to-cyan-800", accent: "#34d399", icon: "💻" },
  SSC: { bg: "from-violet-600 via-purple-700 to-fuchsia-800", accent: "#a78bfa", icon: "📊" },
};

const lectures = [
  { title: "Introduction & Syllabus Overview", duration: "45 min", locked: false },
  { title: "Foundation Concepts - Part 1", duration: "60 min", locked: false },
  { title: "Foundation Concepts - Part 2", duration: "55 min", locked: true },
  { title: "Advanced Topics Module 1", duration: "75 min", locked: true },
  { title: "Advanced Topics Module 2", duration: "80 min", locked: true },
  { title: "Practice Session & Q&A", duration: "50 min", locked: true },
  { title: "Mock Test Discussion", duration: "65 min", locked: true },
  { title: "Revision & Exam Strategy", duration: "40 min", locked: true },
];

const notes = [
  { title: "Complete Syllabus & Study Plan", size: "2.4 MB", locked: false },
  { title: "Foundation Notes - Chapter 1-5", size: "8.2 MB", locked: false },
  { title: "Advanced Notes - Chapter 6-12", size: "12.1 MB", locked: true },
  { title: "Previous Year Question Papers (5 Years)", size: "15.6 MB", locked: true },
  { title: "Quick Revision Cheatsheet", size: "3.8 MB", locked: true },
  { title: "Mock Test Series (Set 1-10)", size: "22.4 MB", locked: true },
];

const CourseDetailModal = ({ course, onClose }: CourseDetailModalProps) => {
  if (!course) return null;

  const style = categoryGradients[course.category] ?? {
    bg: "from-slate-600 to-gray-800",
    accent: "#94a3b8",
    icon: "📚",
  };

  const details = [
    { label: "Price / Fee", value: course.price, icon: "💰" },
    { label: "Original Price", value: course.originalPrice, icon: "🏷️" },
    { label: "Validity", value: course.validity ?? "Lifetime Access", icon: "🗓️" },
    { label: "Course Type", value: course.type ?? "Recorded + Live", icon: "🎬" },
    { label: "Duration", value: course.duration, icon: "⏱️" },
    { label: "Language", value: course.language ?? "Hindi + English", icon: "🌐" },
    { label: "Students Enrolled", value: course.students, icon: "👥" },
    { label: "Rating", value: "4.8 ★", icon: "⭐" },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-start justify-center"
        style={{ paddingTop: "60px" }}
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 40 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full max-w-3xl mx-4 mb-4 rounded-2xl overflow-hidden shadow-2xl"
          style={{ maxHeight: "85vh" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Banner */}
          <div className={`relative bg-gradient-to-br ${style.bg} p-8 overflow-hidden`}>
            <div className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `radial-gradient(circle at 70% 50%, ${style.accent}50 0%, transparent 60%)`,
              }}
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
            >
              <X size={18} />
            </button>
            {course.popular && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-white text-xs font-semibold mb-4">
                <Flame className="h-3 w-3" style={{ color: style.accent }} /> Popular Course
              </div>
            )}
            <div className="flex items-start gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{ background: `${style.accent}20`, border: `1px solid ${style.accent}40` }}
              >
                {style.icon}
              </div>
              <div className="text-white">
                <div className="text-xs font-bold tracking-widest uppercase opacity-70 mb-1" style={{ color: style.accent }}>
                  {course.category} Course
                </div>
                <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">{course.title}</h2>
                <p className="text-white/70 text-sm max-w-md">{course.desc}</p>
              </div>
            </div>
            {/* Price highlight */}
            <div className="mt-6 flex items-center gap-4">
              <span className="text-3xl font-display font-bold text-white">{course.price}</span>
              <span className="text-lg text-white/40 line-through">{course.originalPrice}</span>
              <span
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: `${style.accent}25`, color: style.accent, border: `1px solid ${style.accent}40` }}
              >
                Save {Math.round((1 - parseInt(course.price.replace(/\D/g, "")) / parseInt(course.originalPrice.replace(/\D/g, ""))) * 100)}%
              </span>
            </div>
          </div>

          {/* Body — Scrollable */}
          <div className="overflow-y-auto bg-card" style={{ maxHeight: "calc(85vh - 280px)" }}>
            {/* Course Details Grid */}
            <div className="p-6 border-b border-border/30">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Course Details</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {details.map((d) => (
                  <div key={d.label} className="bg-muted/30 rounded-xl p-3 border border-border/20">
                    <div className="text-lg mb-1">{d.icon}</div>
                    <div className="text-xs text-muted-foreground mb-0.5">{d.label}</div>
                    <div className="text-sm font-semibold text-foreground">{d.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* What you'll learn */}
            <div className="p-6 border-b border-border/30">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">What You'll Get</h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {[
                  "Complete video lectures",
                  "Downloadable study notes",
                  "Practice quizzes & tests",
                  "Live doubt sessions",
                  "Personal mentoring",
                  "Certificate on completion",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Lectures */}
            <div className="p-6 border-b border-border/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Video className="h-4 w-4" /> Lectures ({lectures.length} Videos)
                </h3>
                <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                  2 free preview
                </span>
              </div>
              <div className="space-y-2">
                {lectures.map((lecture, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      lecture.locked
                        ? "border-border/20 bg-muted/10 opacity-60"
                        : "border-border/40 bg-muted/20 hover:bg-muted/40 cursor-pointer"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      lecture.locked ? "bg-muted/50" : "bg-primary/10"
                    }`}>
                      {lecture.locked ? (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Play className="h-4 w-4 text-primary fill-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium truncate ${lecture.locked ? "blur-[3px] text-foreground" : "text-foreground"}`}>
                        {lecture.title}
                      </div>
                      {lecture.locked && (
                        <div className="text-xs text-muted-foreground mt-0.5">🔒 Unlock after enrollment</div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{lecture.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Study Notes ({notes.length} Files)
                </h3>
                <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                  2 free preview
                </span>
              </div>
              <div className="space-y-2">
                {notes.map((note, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      note.locked
                        ? "border-border/20 bg-muted/10 opacity-60"
                        : "border-border/40 bg-muted/20 hover:bg-muted/40 cursor-pointer"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      note.locked ? "bg-muted/50" : "bg-secondary/10"
                    }`}>
                      {note.locked ? (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Download className="h-4 w-4 text-secondary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium truncate ${note.locked ? "blur-[3px] text-foreground" : "text-foreground"}`}>
                        {note.title}
                      </div>
                      {note.locked && (
                        <div className="text-xs text-muted-foreground mt-0.5">🔒 Unlock after enrollment</div>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0">{note.size}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="p-5 bg-card border-t border-border/30 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Ready to unlock everything?</div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-display font-bold text-foreground">{course.price}</span>
                <span className="text-sm text-muted-foreground line-through">{course.originalPrice}</span>
              </div>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-none border-border">
                Maybe Later
              </Button>
              <Button
                className="flex-1 sm:flex-none gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25"
              >
                Enroll Now <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CourseDetailModal;
