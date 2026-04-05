import { motion } from "framer-motion";
import { BookOpen, TrendingUp, Clock, Award, Play, CheckCircle2, BarChart3 } from "lucide-react";

const progressData = [
  { subject: "Polity", progress: 85, color: "bg-primary" },
  { subject: "History", progress: 72, color: "bg-secondary" },
  { subject: "Geography", progress: 60, color: "bg-accent" },
  { subject: "Economics", progress: 45, color: "bg-emerald-500" },
];

const recentActivity = [
  { icon: Play, text: "Completed: Indian Constitution - Part III", time: "2h ago" },
  { icon: CheckCircle2, text: "Quiz Score: 85/100 in Polity Mock", time: "5h ago" },
  { icon: BookOpen, text: "Started: Modern History Module 4", time: "1d ago" },
];

const StudentDashboardDemo = () => (
  <section className="section-padding relative overflow-hidden">
    <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
    <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <span className="text-primary text-sm font-medium tracking-wider uppercase">Student Experience</span>
        <h2 className="text-3xl md:text-4xl font-display font-bold mt-2 mb-4">
          Your Personal <span className="gradient-text">Dashboard</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Track progress, access courses, and analyze performance — all in one place
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="max-w-5xl mx-auto"
      >
        {/* Mock dashboard container */}
        <div className="glass-card glow-border rounded-2xl overflow-hidden">
          {/* Dashboard header */}
          <div className="px-6 py-4 border-b border-border/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-xs text-muted-foreground font-mono">dashboard.aliferacademy.com</span>
            <div />
          </div>

          <div className="p-6">
            {/* Welcome */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display font-semibold text-foreground text-lg">Welcome back, Student! 👋</h3>
                <p className="text-sm text-muted-foreground">UPSC Foundation • Batch 2025</p>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Active
              </div>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { icon: BookOpen, label: "Courses", value: "4", color: "text-primary" },
                { icon: Clock, label: "Hours Studied", value: "128", color: "text-secondary" },
                { icon: TrendingUp, label: "Streak", value: "15 days", color: "text-emerald-400" },
                { icon: Award, label: "Rank", value: "#12", color: "text-accent" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }}
                  className="bg-muted/50 rounded-xl p-4 border border-border/30"
                >
                  <stat.icon className={`h-5 w-5 ${stat.color} mb-2`} />
                  <div className="text-xl font-display font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Progress + Activity */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Subject Progress */}
              <div className="bg-muted/30 rounded-xl p-5 border border-border/30">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <h4 className="font-display font-semibold text-foreground text-sm">Subject Progress</h4>
                </div>
                <div className="space-y-4">
                  {progressData.map((p) => (
                    <div key={p.subject}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">{p.subject}</span>
                        <span className="text-foreground font-medium">{p.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${p.color}`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${p.progress}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-muted/30 rounded-xl p-5 border border-border/30">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-4 w-4 text-primary" />
                  <h4 className="font-display font-semibold text-foreground text-sm">Recent Activity</h4>
                </div>
                <div className="space-y-4">
                  {recentActivity.map((a, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <a.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-foreground">{a.text}</p>
                        <p className="text-xs text-muted-foreground">{a.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default StudentDashboardDemo;
