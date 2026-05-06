import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, BookOpen, Clock, CheckCircle, XCircle,
  ArrowLeft, RefreshCw, Shield, Zap, ChevronDown, ChevronUp,
  User as UserIcon, Phone, Mail, Calendar, Star, PlayCircle, Eye, MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  apiAdminDashboard, apiAdminAllPayments,
  apiAdminApprovePayment, apiAdminRejectPayment, apiSeedCourse,
  apiAdminGetUsers, apiAdminEnrollManual, apiGetCourses
} from '@/lib/api';
import { toast } from 'sonner';

interface DashboardData {
  totalUsers: number;
  totalCourses: number;
  pendingPayments: number;
  approvedPayments: number;
  recentPayments: PaymentItem[];
}

interface UserDetails {
  _id: string;
  name: string;
  email: string;
  phone: string;
  age?: number;
  studyStreak: number;
  hoursStudied: number;
  completedVideos: string[];
  enrolledCourses: any[];
  isVerified: boolean;
  createdAt: string;
}

interface PaymentItem {
  _id: string;
  userId: UserDetails;
  courseId: { _id: string; title: string; price: number };
  status: 'pending' | 'approved' | 'rejected';
  utrNumber: string;
  createdAt: string;
}

interface CourseItem {
  _id: string;
  title: string;
}

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [users, setUsers] = useState<UserDetails[]>([]);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [tab, setTab] = useState<'requests' | 'users'>('requests');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [manualEnrollUser, setManualEnrollUser] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>('');

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/dashboard');
      return;
    }
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [dash, pays, allUsers, allCourses] = await Promise.all([
        apiAdminDashboard(),
        apiAdminAllPayments(),
        apiAdminGetUsers(),
        apiGetCourses()
      ]);
      setStats(dash);
      setPayments(pays);
      setUsers(allUsers);
      setCourses(allCourses);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (paymentId: string) => {
    setActionId(paymentId);
    try {
      await apiAdminApprovePayment(paymentId);
      toast.success('Payment approved & user enrolled! ✅');
      await loadData();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to approve');
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (paymentId: string) => {
    setActionId(paymentId);
    try {
      await apiAdminRejectPayment(paymentId);
      toast.success('Payment rejected');
      await loadData();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to reject');
    } finally {
      setActionId(null);
    }
  };

  const handleManualEnroll = async (userId: string) => {
    if (!selectedCourse) return toast.error('Please select a course');
    setActionId(userId);
    try {
      const res = await apiAdminEnrollManual(userId, selectedCourse);
      toast.success(res.message);
      setManualEnrollUser(null);
      setSelectedCourse('');
      await loadData();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Enrollment failed');
    } finally {
      setActionId(null);
    }
  };

  const handleSeedCourse = async () => {
    try {
      const result = await apiSeedCourse();
      toast.success(result.message);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to seed');
    }
  };

  const filteredPayments = payments.filter(p =>
    filter === 'all' ? true : p.status === filter
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border/30 px-4 py-4 sticky top-0 z-40">
        <div className="container mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/dashboard')} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <Shield className="h-5 w-5 text-primary" />
            <h1 className="font-bold text-lg">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={loadData} className="gap-2">
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-6">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Users, label: 'Total Users', value: stats.totalUsers, color: 'text-primary' },
              { icon: BookOpen, label: 'Courses', value: stats.totalCourses, color: 'text-secondary' },
              { icon: Clock, label: 'Pending', value: stats.pendingPayments, color: 'text-yellow-400' },
              { icon: CheckCircle, label: 'Approved', value: stats.approvedPayments, color: 'text-emerald-400' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-2xl p-5 border border-border/20"
              >
                <s.icon className={`h-5 w-5 ${s.color} mb-2`} />
                <div className="text-3xl font-bold font-display">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex bg-muted/30 rounded-xl p-1 gap-1 mb-6 max-w-fit">
          <button
            onClick={() => setTab('requests')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              tab === 'requests' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Payment Requests
          </button>
          <button
            onClick={() => setTab('users')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              tab === 'users' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All Users
          </button>
        </div>

        {tab === 'requests' ? (
          <div className="glass-card rounded-2xl border border-border/20 overflow-hidden">
            <div className="px-5 py-4 border-b border-border/30 flex items-center justify-between flex-wrap gap-3">
              <h2 className="font-semibold">Payment Requests</h2>
              <div className="flex bg-muted/50 rounded-lg p-1 gap-1">
                {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 text-xs rounded-md transition-all font-medium ${
                      filter === f ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredPayments.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Clock className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>No {filter} payments</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/30 border-b border-border/20 text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="px-6 py-4 font-semibold">User Details</th>
                      <th className="px-6 py-4 font-semibold">Course & Price</th>
                      <th className="px-6 py-4 font-semibold">UTR / Timing</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/10">
                    {filteredPayments.map((payment) => {
                      const dateObj = new Date(payment.createdAt);
                      const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
                      const date = dateObj.toLocaleDateString();
                      const isExpanded = expandedId === payment._id;

                      return (
                        <>
                          <motion.tr
                            key={payment._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`hover:bg-muted/10 transition-colors cursor-pointer ${isExpanded ? 'bg-muted/20' : ''}`}
                            onClick={() => setExpandedId(isExpanded ? null : payment._id)}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                  {payment.userId?.name?.charAt(0)}
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-semibold text-sm">{payment.userId?.name}</span>
                                  <span className="text-[10px] text-muted-foreground">{payment.userId?.email}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">{payment.courseId?.title || 'Course Unavailable'}</span>
                                <span className="text-[10px] text-emerald-400 font-bold">₹{payment.amount}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                                  <Clock className="h-3 w-3" />
                                  {time}
                                </div>
                                <span className="text-[10px] text-muted-foreground font-mono">{payment.utrNumber || 'No UTR'}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2 items-center">
                                {payment.status === 'pending' ? (
                                  <>
                                    <Button
                                      size="sm"
                                      className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4"
                                      disabled={actionId === payment._id}
                                      onClick={(e) => { e.stopPropagation(); handleApprove(payment._id); }}
                                    >
                                      {actionId === payment._id ? '...' : 'Approve'}
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-8 border-red-500/30 text-red-400 hover:bg-red-500/10"
                                      disabled={actionId === payment._id}
                                      onClick={(e) => { e.stopPropagation(); handleReject(payment._id); }}
                                    >
                                      <XCircle className="h-4 w-4" />
                                    </Button>
                                  </>
                                ) : (
                                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                                    payment.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                                  }`}>
                                    {payment.status}
                                  </span>
                                )}
                                <button className="ml-2 text-muted-foreground">
                                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                          
                          {/* Expanded Details */}
                          <AnimatePresence>
                            {isExpanded && (
                              <tr>
                                <td colSpan={4} className="px-6 py-0 border-none bg-muted/5">
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                                      <div className="space-y-4">
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                          <UserIcon size={12} /> User Profile
                                        </h4>
                                        <div className="space-y-2">
                                          <p className="text-xs flex items-center gap-2"><Phone size={12} className="text-muted-foreground" /> {payment.userId?.phone || 'N/A'}</p>
                                          <p className="text-xs flex items-center gap-2"><Calendar size={12} className="text-muted-foreground" /> Joined: {new Date(payment.userId?.createdAt).toLocaleDateString()}</p>
                                        </div>
                                      </div>
                                      <div className="space-y-4">
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                          <Zap size={12} /> Learning Stats
                                        </h4>
                                        <div className="space-y-2">
                                          <p className="text-xs flex items-center gap-2"><Clock size={12} className="text-muted-foreground" /> Hours: {payment.userId?.hoursStudied?.toFixed(1) || 0}h</p>
                                          <p className="text-xs flex items-center gap-2"><PlayCircle size={12} className="text-muted-foreground" /> Videos: {payment.userId?.completedVideos?.length || 0} completed</p>
                                          <p className="text-xs flex items-center gap-2"><Zap size={12} className="text-muted-foreground" /> Streak: {payment.userId?.studyStreak || 0} days</p>
                                        </div>
                                      </div>
                                      <div className="space-y-4">
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                          <Clock size={12} /> Payment Detail
                                        </h4>
                                        <div className="space-y-2">
                                          <p className="text-xs">Date: {date}</p>
                                          <p className="text-xs">Time: {time}</p>
                                          <p className="text-xs font-mono bg-background p-1.5 rounded border border-border/50 text-[10px]">UTR: {payment.utrNumber || 'N/A'}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                </td>
                              </tr>
                            )}
                          </AnimatePresence>
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          /* Users Tab */
          <div className="glass-card rounded-2xl border border-border/20 overflow-hidden">
            <div className="px-5 py-4 border-b border-border/30">
              <h2 className="font-semibold">System Users</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/30 border-b border-border/20 text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-6 py-4 font-semibold">User</th>
                    <th className="px-6 py-4 font-semibold">Stats</th>
                    <th className="px-6 py-4 font-semibold">Enrollments</th>
                    <th className="px-6 py-4 font-semibold text-right">Access Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/10">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-muted/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold">
                            {u.name.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm">{u.name}</span>
                            <div className="flex flex-col text-[10px] text-muted-foreground">
                              <span className="flex items-center gap-1.5"><Mail size={10} /> {u.email}</span>
                              <span className="flex items-center gap-1.5 font-bold text-primary"><Phone size={10} /> {u.phone}</span>
                              <span className="flex items-center gap-1.5"><Calendar size={10} /> Joined: {new Date(u.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-xs font-bold">{u.hoursStudied?.toFixed(1) || 0}h</p>
                            <p className="text-[9px] text-muted-foreground uppercase">Hours</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs font-bold">{u.studyStreak || 0}</p>
                            <p className="text-[9px] text-muted-foreground uppercase">Streak</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs font-bold">{u.completedVideos?.length || 0}</p>
                            <p className="text-[9px] text-muted-foreground uppercase">Videos</p>
                          </div>
                          <div className="text-center">
                            <p className={`text-xs font-bold ${u.subscriptionExpiry && new Date(u.subscriptionExpiry) > new Date() ? 'text-emerald-400' : 'text-red-400'}`}>
                              {u.subscriptionExpiry ? new Date(u.subscriptionExpiry).toLocaleDateString() : 'N/A'}
                            </p>
                            <p className="text-[9px] text-muted-foreground uppercase">Expiry</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {u.enrolledCourses?.length > 0 ? (
                            u.enrolledCourses.map((c: any) => (
                              <span key={c.course?._id || c._id} className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/20">
                                {c.course?.title || 'Unknown Course'}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-muted-foreground italic">No active enrollments</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {manualEnrollUser === u._id ? (
                          <div className="flex items-center justify-end gap-2">
                            <select 
                              className="bg-background border border-border rounded text-xs p-1 h-8"
                              value={selectedCourse}
                              onChange={(e) => setSelectedCourse(e.target.value)}
                            >
                              <option value="">Select Course</option>
                              {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                            </select>
                            <Button 
                              size="sm" 
                              className="h-8 bg-primary"
                              onClick={() => handleManualEnroll(u._id)}
                              disabled={actionId === u._id}
                            >
                              Enroll
                            </Button>
                            <button onClick={() => setManualEnrollUser(null)} className="text-muted-foreground">
                              <XCircle size={18} />
                            </button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 gap-2 border-primary/30 text-primary hover:bg-primary/10"
                            onClick={() => setManualEnrollUser(u._id)}
                          >
                            <BookOpen size={14} /> Manual Access
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
