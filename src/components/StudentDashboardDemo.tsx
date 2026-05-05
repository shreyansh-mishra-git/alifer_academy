import { motion } from "framer-motion";
import { BookOpen, TrendingUp, Clock, Award, Play, CheckCircle2, BarChart3 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const StudentDashboardDemo = () => {
  const { isLoggedIn, user } = useAuth();

  // Real data if logged in, otherwise dummy
  const userData = isLoggedIn && user ? {
    name: user.name.split(' ')[0],
    courses: user.enrolledCourses?.length || 0,
    hours: Math.round(user.hoursStudied || 0),
    streak: user.studyStreak || 0,
    progress: user.completedVideos?.length || 0,
    isReal: true
  } : {
    name: "Student",
    courses: "4",
    hours: "128",
    streak: "15",
    progress: 85,
    isReal: false
  };

  const progressData = userData.isReal && user?.enrolledCourses?.length
    ? user.enrolledCourses.slice(0, 4).map((enrolled: any, idx) => {
        const courseCompleted = enrolled.course?.videos?.filter((v: any) => v.videoId && user?.completedVideos?.includes(v.videoId)).length || 0;
        const courseTotal = enrolled.course?.videos?.length || 0;
        const coursePct = courseTotal > 0 ? Math.round((courseCompleted / courseTotal) * 100) : 0;
        return {
          subject: enrolled.course?.title || `Course ${idx + 1}`,
          progress: coursePct,
          color: ["bg-primary", "bg-secondary", "bg-accent", "bg-emerald-500"][idx % 4]
        };
      })
    : (isLoggedIn ? [
        { subject: "Course Progress", progress: Math.min(100, Math.round((user?.completedVideos?.length || 0) * 10)), color: "bg-primary" },
        { subject: "Concepts", progress: 0, color: "bg-secondary" },
        { subject: "Practice", progress: 0, color: "bg-accent" },
        { subject: "Revision", progress: 0, color: "bg-emerald-500" },
      ] : [
        { subject: "Polity", progress: 85, color: "bg-primary" },
        { subject: "History", progress: 72, color: "bg-secondary" },
        { subject: "Geography", progress: 60, color: "bg-accent" },
        { subject: "Economics", progress: 45, color: "bg-emerald-500" },
      ]);

  const recentActivity = [
    { icon: Play, text: userData.isReal && user?.enrolledCourses?.length ? `Last active in ${user.enrolledCourses[0].course?.title || user.enrolledCourses[0].title || 'your courses'}` : "Completed: Indian Constitution - Part III", time: "Just now" },
    { icon: CheckCircle2, text: userData.isReal ? "Keep pushing your limits!" : "Quiz Score: 85/100 in Polity Mock", time: "2h ago" },
    { icon: BookOpen, text: userData.isReal ? "Check out new lessons" : "Started: Modern History Module 4", time: "1d ago" },
  ];

  return (
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
          <span className="text-primary text-sm font-medium tracking-wider uppercase">
            {userData.isReal ? "Your Learning Status" : "Student Experience"}
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-2 mb-4">
            {userData.isReal ? "Your Personalized" : "Your Personal"} <span className="gradient-text">Dashboard</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {userData.isReal 
              ? "Live tracking of your preparation journey and academic records" 
              : "Track progress, access courses, and analyze performance — all in one place"}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-5xl mx-auto"
        >
          <div className="glass-card glow-border rounded-2xl overflow-hidden">
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
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display font-semibold text-foreground text-lg">Welcome back, {userData.name}! 👋</h3>
                  <p className="text-sm text-muted-foreground">
                    {userData.isReal ? "Active Student Profile" : "UPSC Foundation • Batch 2025"}
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Active
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { icon: BookOpen, label: "Courses", value: userData.courses, color: "text-primary" },
                  { icon: Clock, label: "Hours Studied", value: userData.hours, color: "text-secondary" },
                  { icon: TrendingUp, label: "Streak", value: `${userData.streak} days`, color: "text-emerald-400" },
                  { icon: Award, label: userData.isReal ? "Videos Done" : "Rank", value: userData.isReal ? userData.progress : "#12", color: "text-accent" },
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

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-muted/30 rounded-xl p-5 border border-border/30">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    <h4 className="font-display font-semibold text-foreground text-sm">Course Progress</h4>
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
};

export default StudentDashboardDemo;
