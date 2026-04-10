import { motion } from "framer-motion";
import { Youtube, Send, Instagram, ExternalLink, Award, Users, BookOpen, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import teacherImg from "@/assets/teacher-profile.jpg";

const socials = [
  {
    icon: Youtube,
    label: "YouTube",
    sub: "Subscribe for free lectures",
    color: "hover:border-red-500/50 hover:bg-red-500/10",
    iconColor: "text-red-400",
    href: "https://youtube.com/@aliferacademy?si=lbb_DiDkJH2VVQuR",
  },
  {
    icon: Send,
    label: "Telegram",
    sub: "Join our study group",
    color: "hover:border-blue-400/50 hover:bg-blue-400/10",
    iconColor: "text-blue-400",
    href: "https://t.me/AliferAcademy",
  },
  {
    icon: Instagram,
    label: "Instagram",
    sub: "Follow for updates",
    color: "hover:border-pink-500/50 hover:bg-pink-500/10",
    iconColor: "text-pink-400",
    href: "https://www.instagram.com/alifer_academy?igsh=enJpOWJ5Nmc2eWVx",
  },
];

const achievements = [
  { icon: Users, value: "10K+", label: "Students Mentored", color: "text-primary" },
  { icon: Award, value: "100+", label: "Total Selections", color: "text-secondary" },
  { icon: BookOpen, value: "50+", label: "Courses Created", color: "text-accent" },
  { icon: Star, value: "4.9★", label: "Average Rating", color: "text-yellow-400" },
];

const TeacherSection = () => (
  <section id="teacher" className="section-padding relative overflow-hidden">
    {/* Background blobs */}
    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
    <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />

    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <span className="text-primary text-sm font-medium tracking-wider uppercase">Featured Faculty</span>
        <h2 className="text-3xl md:text-4xl font-display font-bold mt-2 mb-4">
          Meet <span className="gradient-text">Alifer Sir</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          India's trusted educator for competitive exam preparation
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Image Column */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex justify-center lg:justify-end"
        >
          <div className="relative">
            {/* Outer glow ring */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 blur-2xl" />

            {/* Card */}
            <div className="relative glass-card p-2 rounded-3xl w-72 md:w-80">
              <img
                src={teacherImg}
                alt="Alifer Sir"
                className="w-full aspect-[4/5] object-cover rounded-2xl"
              />

              {/* Floating badge — top right */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 glass-card px-3 py-2 rounded-2xl flex items-center gap-2 shadow-lg"
              >
                <span className="text-lg">🏆</span>
                <div>
                  <div className="text-xs font-bold text-foreground">Top Educator</div>
                  <div className="text-xs text-muted-foreground">2024</div>
                </div>
              </motion.div>

              {/* Floating badge — bottom left */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                className="absolute -bottom-4 -left-4 glass-card px-3 py-2 rounded-2xl flex items-center gap-2 shadow-lg"
              >
                <span className="text-lg">⭐</span>
                <div>
                  <div className="text-xs font-bold text-foreground">4.9 Rating</div>
                  <div className="text-xs text-muted-foreground">10K+ Reviews</div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Content Column */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="space-y-6"
        >
          {/* Bio */}
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              {["UPSC Expert", "NDA Specialist", "GATE Mentor", "10+ Years Exp"].map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-muted-foreground leading-relaxed text-base">
              Renowned educator at{" "}
              <strong className="text-foreground">DBUU Dehradun</strong> and{" "}
              <strong className="text-foreground">Sunya IAS</strong>. With over a decade of experience in competitive exam preparation, Alifer Sir has guided thousands of students to crack UPSC, NDA, GATE and more through his unique, conceptual teaching approach.
            </p>
            <p className="text-muted-foreground leading-relaxed text-base mt-3">
              Known for his ability to simplify the most complex topics, his structured study plans and motivational teaching style have produced <strong className="text-foreground">100+ selections</strong> across top competitive exams.
            </p>
          </div>

          {/* Achievement stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {achievements.map((a, i) => (
              <motion.div
                key={a.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.08 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="glass-card p-3 text-center rounded-xl"
              >
                <a.icon className={`h-5 w-5 mx-auto mb-1.5 ${a.color}`} />
                <div className={`text-lg font-display font-bold ${a.color}`}>{a.value}</div>
                <div className="text-xs text-muted-foreground leading-tight">{a.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Social buttons */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-3">Connect with Alifer Sir</p>
            <div className="flex flex-col sm:flex-row gap-3">
              {socials.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border border-border/40 bg-muted/20 transition-all duration-200 ${s.color} group flex-1`}
                >
                  <s.icon className={`h-5 w-5 ${s.iconColor} flex-shrink-0`} />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-foreground">{s.label}</div>
                    <div className="text-xs text-muted-foreground truncate">{s.sub}</div>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground ml-auto flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default TeacherSection;
