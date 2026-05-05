import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen, TrendingUp, Clock, Award, Play, CheckCircle2,
  BarChart3, User, Compass, Flame, LogOut, ExternalLink,
  AlertCircle, ChevronRight, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { apiGetCourses, apiGetMyPayments } from '@/lib/api';
import { toast } from 'sonner';

interface CourseItem {
  _id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  videos: Array<{ _id: string; isFree: boolean; isLocked: boolean }>;
}

interface Payment {
  _id: string;
  courseId: { _id: string; title: string; price: number };
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const TABS = ['enrolled', 'explore', 'profile'] as const;
type Tab = typeof TABS[number];

const getBaseStudents = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return 100 + (Math.abs(hash) % 51);
};

const Dashboard = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('enrolled');
  const [allCourses, setAllCourses] = useState<CourseItem[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  useEffect(() => {
    loadCourses();
    loadPayments();
    const interval = setInterval(() => {
      refreshUser();
      loadPayments();
    }, 15000); // refresh every 15s for payment status updates
    return () => clearInterval(interval);
  }, []);

  const loadCourses = async () => {
    setLoadingCourses(true);
    try {
      const data = await apiGetCourses();
      setAllCourses(data);
    } catch {
      // silently fail
    } finally {
      setLoadingCourses(false);
    }
  };

  const loadPayments = async () => {
    try {
      const data = await apiGetMyPayments();
      setPayments(data);
    } catch {
      // silently fail
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const enrolledIds = user?.enrolledCourses?.map((c: any) => (c.course?._id || c.course || c._id).toString()) || [];
  const enrolledCourses = allCourses.filter((c) => enrolledIds.includes(c._id));
  const exploreableCourses = allCourses.filter((c) => !enrolledIds.includes(c._id));

  const pendingPayments = payments.filter((p) => p.status === 'pending');
  const completedVideosCount = user?.completedVideos?.length || 0;
  const totalVideos = enrolledCourses.reduce((sum, c) => sum + c.videos.length, 0);
  const progressPct = totalVideos > 0 ? Math.round((completedVideosCount / totalVideos) * 100) : 0;

  const tabConfig = [
    { key: 'enrolled' as Tab, icon: BookOpen, label: 'My Courses' },
    { key: 'explore' as Tab, icon: Compass, label: 'Explore' },
    { key: 'profile' as Tab, icon: User, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border/30 px-4 py-4 sticky top-0 z-40">
        <div className="container mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-bold font-display text-foreground">Welcome, {user?.name?.split(' ')[0]}! 👋</h1>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {user?.isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin')}
                className="gap-2 border-primary/30 text-primary hover:bg-primary/10"
              >
                <Star className="h-3.5 w-3.5" /> Admin Panel
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="h-3.5 w-3.5" /> Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-6">
        {/* Pending payment alerts */}
        {pendingPayments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6 flex items-start gap-3"
          >
            <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-300">Payment Pending Approval</p>
              <p className="text-xs text-yellow-400/80 mt-0.5">
                Your payment for {pendingPayments.map(p => p.courseId?.title).join(', ')} is being reviewed.
                Access will be granted within 12 hours. In the meantime, feel free to explore our free preview lessons!
              </p>
            </div>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: BookOpen, label: 'Enrolled', value: enrolledCourses.length, color: 'text-primary' },
            { icon: Flame, label: 'Streak', value: `${user?.studyStreak || 0}d`, color: 'text-orange-400' },
            { icon: Clock, label: 'Hours', value: `${Math.round(user?.hoursStudied || 0)}h`, color: 'text-secondary' },
            { icon: Award, label: 'Progress', value: `${progressPct}%`, color: 'text-emerald-400' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="glass-card rounded-2xl p-4 border border-border/20"
            >
              <stat.icon className={`h-5 w-5 ${stat.color} mb-2`} />
              <div className="text-2xl font-display font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex bg-muted/50 rounded-xl p-1 mb-6 gap-1">
          {tabConfig.map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === key
                  ? 'bg-primary text-primary-foreground shadow'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'enrolled' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {loadingCourses ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-muted-foreground animate-pulse">Loading your dashboard...</p>
              </div>
            ) : enrolledCourses.length === 0 ? (
              <div className="text-center py-16">
                <BookOpen className="h-14 w-14 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">No courses yet</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Enroll in a course to start learning
                </p>
                <Button onClick={() => setActiveTab('explore')}>
                  Explore Courses
                </Button>
              </div>
            ) : (
              <div>
                {/* Progress Tracking Cards */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {/* Subject Progress */}
                  <div className="glass-card rounded-2xl p-5 border border-border/20">
                    <div className="flex items-center gap-2 mb-4">
                      <BarChart3 className="h-4 w-4 text-primary" />
                      <h4 className="font-display font-semibold text-foreground text-sm">Subject Wise Mastery</h4>
                    </div>
                    <div className="space-y-4">
                      {(enrolledCourses.length > 0 ? enrolledCourses.slice(0, 4).map((c, idx) => {
                        const courseCompleted = c.videos?.filter(v => v.videoId && user?.completedVideos?.includes(v.videoId)).length || 0;
                        const courseTotal = c.videos?.length || 0;
                        const coursePct = courseTotal > 0 ? Math.round((courseCompleted / courseTotal) * 100) : 0;
                        return {
                          subject: c.title,
                          pct: coursePct,
                          color: ["bg-primary", "bg-secondary", "bg-accent", "bg-emerald-500"][idx % 4]
                        };
                      }) : [
                        { subject: "Concepts", pct: Math.min(100, Math.round((user?.completedVideos?.length || 0) * 10)), color: "bg-primary" },
                        { subject: "Problem Solving", pct: 0, color: "bg-secondary" },
                        { subject: "Mock Tests", pct: 0, color: "bg-accent" },
                        { subject: "Revision", pct: 0, color: "bg-emerald-500" },
                      ]).map((p) => (
                        <div key={p.subject}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">{p.subject}</span>
                            <span className="text-foreground font-medium">{p.pct}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${p.color}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${p.pct}%` }}
                              transition={{ duration: 1 }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="glass-card rounded-2xl p-5 border border-border/20">
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="h-4 w-4 text-primary" />
                      <h4 className="font-display font-semibold text-foreground text-sm">Recent Activity</h4>
                    </div>
                    <div className="space-y-4">
                      {[
                        { icon: Play, text: user?.completedVideos?.length ? `Completed a lesson in ${enrolledCourses[0]?.title || 'your course'}` : "Start your first lesson!", time: "Recent" },
                        { icon: Award, text: `Gained ${user?.studyStreak || 0} Day Streak!`, time: "Today" },
                        { icon: BookOpen, text: `Enrolled in ${enrolledCourses.length} Courses`, time: "Active" },
                      ].map((a, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <a.icon className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs text-foreground font-medium">{a.text}</p>
                            <p className="text-[10px] text-muted-foreground">{a.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                  <Play className="h-5 w-5 text-primary" fill="currentColor" /> Resume Learning
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {enrolledCourses.map((course, i) => (
                    <motion.div
                      key={course._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass-card rounded-2xl overflow-hidden border border-border/20 cursor-pointer group"
                      onClick={() => navigate(`/course/${course._id}`)}
                    >
                      <div className="p-5 flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center text-2xl flex-shrink-0">
                          📚
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold truncate group-hover:text-primary transition-colors">
                            {course.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {course.videos.length} videos • {getBaseStudents(course._id) + (course.studentsCount || 0)} students
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                      </div>
                      <div className="px-5 pb-4">
                        <Button size="sm" className="w-full gap-2 group-hover:bg-primary/90" onClick={(e) => { e.stopPropagation(); navigate(`/course/${course._id}`); }}>
                          <Play className="h-3.5 w-3.5" fill="currentColor" /> Start Watching
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'explore' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {loadingCourses ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(exploreableCourses.length > 0 ? exploreableCourses : allCourses).map((course, i) => (
                  <motion.div
                    key={course._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="glass-card rounded-2xl overflow-hidden border border-border/20 cursor-pointer group"
                    onClick={() => navigate(`/course/${course._id}`)}
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-xl">📚</div>
                        {enrolledIds.includes(course._id) && (
                          <span className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">Enrolled</span>
                        )}
                      </div>
                      <h4 className="font-semibold mb-1 group-hover:text-primary transition-colors">{course.title}</h4>
                      <p className="text-[10px] text-muted-foreground mb-3">{course.videos.length} videos • {getBaseStudents(course._id) + (course.studentsCount || 0)} students</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-primary">₹{course.price}/mo</span>
                          <span className="text-[10px] line-through text-muted-foreground ml-2">₹{course.originalPrice}</span>
                        </div>
                        <Button size="sm" variant="outline" className="gap-1" onClick={(e) => { e.stopPropagation(); navigate(`/course/${course._id}`); }}>
                          View <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'profile' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg mx-auto">
            <div className="glass-card rounded-2xl p-6 border border-border/20 mb-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-2xl">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-xl">{user?.name}</h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Full Name', value: user?.name },
                  { label: 'Email', value: user?.email },
                  { label: 'Phone', value: user?.phone },
                  { label: 'Age', value: user?.age },
                  { label: 'Enrolled Courses', value: user?.enrolledCourses?.length || 0 },
                  { label: 'Study Streak', value: `${user?.studyStreak || 0} days` },
                  { label: 'Hours Studied', value: `${Math.round(user?.hoursStudied || 0)} hrs` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-border/20 last:border-0">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="text-sm font-medium">{value || '—'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment history */}
            {payments.length > 0 && (
              <div className="glass-card rounded-2xl p-5 border border-border/20">
                <h4 className="font-semibold mb-4 text-sm text-muted-foreground uppercase tracking-wider">Payment History</h4>
                <div className="space-y-3">
                  {payments.map((p) => (
                    <div key={p._id} className="flex items-center justify-between py-2 border-b border-border/20 last:border-0">
                      <div>
                        <p className="text-sm font-medium">{p.courseId?.title}</p>
                        <p className="text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                        p.status === 'approved'
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : p.status === 'pending'
                          ? 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30'
                          : 'bg-red-500/15 text-red-400 border-red-500/30'
                      }`}>
                        {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button variant="outline" className="w-full mt-4 gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10" onClick={handleLogout}>
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
