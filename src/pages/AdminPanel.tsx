import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, BookOpen, Clock, CheckCircle, XCircle,
  ArrowLeft, RefreshCw, Shield, Zap, ChevronDown, ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  apiAdminDashboard, apiAdminAllPayments,
  apiAdminApprovePayment, apiAdminRejectPayment, apiSeedCourse
} from '@/lib/api';
import { toast } from 'sonner';

interface DashboardData {
  totalUsers: number;
  totalCourses: number;
  pendingPayments: number;
  approvedPayments: number;
  recentPayments: PaymentItem[];
}

interface PaymentItem {
  _id: string;
  userId: { name: string; email: string; phone: string };
  courseId: { title: string; price: number };
  status: 'pending' | 'approved' | 'rejected';
  utrNumber: string;
  createdAt: string;
}

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [expanded, setExpanded] = useState<string | null>(null);

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
      const [dash, pays] = await Promise.all([apiAdminDashboard(), apiAdminAllPayments()]);
      setStats(dash);
      setPayments(pays);
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
        <div className="container mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/dashboard')} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <Shield className="h-5 w-5 text-primary" />
            <h1 className="font-bold text-lg">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSeedCourse} className="gap-2 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
              <Zap className="h-3.5 w-3.5" /> Seed Course
            </Button>
            <Button variant="outline" size="sm" onClick={loadData} className="gap-2">
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-6">
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

        {/* Payments */}
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
                    <th className="px-6 py-4 font-semibold">User Name</th>
                    <th className="px-6 py-4 font-semibold">Course Name</th>
                    <th className="px-6 py-4 font-semibold">System Time</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/10">
                  {filteredPayments.map((payment) => {
                    const time = new Date(payment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
                    return (
                      <motion.tr
                        key={payment._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-muted/10 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm">{payment.userId?.name}</span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{payment.userId?.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium">{payment.courseId?.title}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-sm font-bold text-primary">
                            <Clock className="h-3.5 w-3.5" />
                            {time}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {payment.status === 'pending' && (
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4"
                                disabled={actionId === payment._id}
                                onClick={() => handleApprove(payment._id)}
                              >
                                {actionId === payment._id ? 'Processing...' : 'Approve'}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 border-red-500/30 text-red-400 hover:bg-red-500/10"
                                disabled={actionId === payment._id}
                                onClick={() => handleReject(payment._id)}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                          {payment.status !== 'pending' && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                              payment.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                              {payment.status}
                            </span>
                          )}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
