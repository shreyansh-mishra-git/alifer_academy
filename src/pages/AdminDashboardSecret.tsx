import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, User, BookOpen, Check, X, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiAdminApprovePayment, apiAdminRejectPayment, apiGetAdminSecretData } from '@/lib/api';
import { toast } from 'sonner';

const AdminDashboardSecret = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const result = await apiGetAdminSecretData();
      console.log("Admin Data:", result);
      setData(result);
    } catch (err) {
      console.error("Error loading admin data:", err);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await apiAdminApprovePayment(id);
      toast.success('Payment Approved');
      fetchAdminData();
    } catch (err) {
      toast.error('Approval failed');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await apiAdminRejectPayment(id);
      toast.success('Payment Rejected');
      fetchAdminData();
    } catch (err) {
      toast.error('Rejection failed');
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              Secret Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Manage pending enrollments and system status</p>
          </div>
          <Button variant="outline" onClick={fetchAdminData} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {loading && !data ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Users', value: data?.totalUsers, icon: User, color: 'text-blue-400' },
                { label: 'Active Courses', value: data?.totalCourses, icon: BookOpen, color: 'text-purple-400' },
                { label: 'Pending Payments', value: data?.pendingPayments, icon: Clock, color: 'text-yellow-400' },
                { label: 'Total Sales', value: data?.approvedPayments, icon: Check, color: 'text-emerald-400' },
              ].map((stat, i) => (
                <div key={i} className="glass-card p-6 border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Stats</span>
                  </div>
                  <p className="text-2xl font-bold">{stat.value || 0}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Pending Payments Table */}
            <div className="glass-card overflow-hidden border border-border/50">
              <div className="px-6 py-4 border-b border-border/30 bg-muted/30">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-400" />
                  Pending Payment Verifications
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-muted/10">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">User Details</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Course</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">UTR / Phone</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Exact Time</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {data?.recentPayments?.length > 0 ? (
                      data.recentPayments.map((p: any) => (
                        <tr key={p._id} className="hover:bg-muted/5 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <p className="font-bold text-sm text-foreground">{p.userId?.name || 'Unknown'}</p>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{p.userId?.email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded border border-primary/20">
                              {p.courseId?.title}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-mono text-[11px] text-emerald-400 font-bold">UTR: {p.utrNumber || 'N/A'}</span>
                              <span className="text-[10px] text-muted-foreground">ID: {p.userId?.phone || 'N/A'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-primary flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                              </span>
                              <span className="text-[9px] text-muted-foreground">
                                {new Date(p.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 w-8 p-0 text-emerald-400 border-emerald-400/30 hover:bg-emerald-400/10"
                                onClick={() => handleApprove(p._id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 w-8 p-0 text-red-400 border-red-400/30 hover:bg-red-400/10"
                                onClick={() => handleReject(p._id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                          <div className="flex flex-col items-center gap-2">
                            <AlertCircle className="h-8 w-8 opacity-20" />
                            <p>No pending payments found</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* RAW DATA DEBUG SECTION */}
            <div className="mt-8 p-4 bg-black/50 rounded-lg border border-white/10">
              <h3 className="text-xs font-mono text-muted-foreground mb-2">Raw JSON Data:</h3>
              <pre className="text-[10px] font-mono text-emerald-400/70 overflow-auto max-h-40">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardSecret;
