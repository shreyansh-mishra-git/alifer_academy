import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, Play, CheckCircle, ArrowLeft, Clock, Users,
  BookOpen, Shield, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { apiGetCourse, apiMarkVideoComplete } from '@/lib/api';
import PaymentModal from '@/components/PaymentModal';
import AuthModal from '@/components/AuthModal';
import SecurePDFModal from '@/components/SecurePDFModal';
import { toast } from 'sonner';

interface Video {
  _id: string;
  title: string;
  duration: string;
  isFree: boolean;
  isLocked: boolean;
  videoId?: string;
  order: number;
}

interface PDFResource {
  _id: string;
  title: string;
  url?: string;
  isLocked: boolean;
}

interface CourseData {
  _id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  duration: string;
  category: string;
  studentsCount: number;
  videos: Video[];
  pdfs: PDFResource[];
  isEnrolled: boolean;
  isPaymentPending?: boolean;
}

const CoursePage = () => {
  const { id } = useParams<{ id: string }>();
  console.log("Frontend ID:", id);
  const navigate = useNavigate();
  const { user, isLoggedIn, refreshUser } = useAuth();

  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState<PDFResource | null>(null);
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);

  const isEnrolled = course?.isEnrolled ||
    (user?.enrolledCourses?.some((c: any) => (c.course?._id || c.course) === id) ?? false);

  const [fakeStudents] = useState(() => Math.floor(Math.random() * 51) + 100);

  useEffect(() => {
    if (!id) return;
    console.log("Course ID:", id);
    loadCourse();
  }, [id, user]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      const data = await apiGetCourse(id!);
      setCourse(data);
      // Auto-select free video if none selected
      if (!activeVideo) {
        const freeVid = data.videos.find((v: Video) => v.isFree && v.videoId);
        if (freeVid) setActiveVideo(freeVid);
        else if (data.videos.length > 0) setActiveVideo(data.videos[0]);
      }
    } catch {
      toast.error('Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const playerContainerRef = useState<HTMLDivElement | null>(null)[0]; // Mocking ref for now, will use actual ref
  const [isFs, setIsFs] = useState(false);

  const toggleFullScreen = () => {
    const el = document.getElementById('player-container');
    if (!el) return;

    if (!document.fullscreenElement) {
      el.requestFullscreen().catch((err) => {
        toast.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFs(true);
    } else {
      document.exitFullscreen();
      setIsFs(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFs(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleVideoClick = (video: Video) => {
    if (video.isFree && !isLoggedIn) {
      toast.info('Please login to watch the free preview');
      setAuthOpen(true);
      return;
    }
    setActiveVideo(video);
    // Mark as completed only if it's playable
    if (id && video.videoId) {
      apiMarkVideoComplete(id, video.videoId).catch(() => {});
    }
  };

  const handleEnrollClick = () => {
    if (!isLoggedIn) {
      setAuthOpen(true);
      return;
    }
    setPaymentOpen(true);
  };

  const handlePaymentSuccess = async () => {
    await refreshUser();
    await loadCourse();
  };

  const handlePdfView = (pdf: PDFResource) => {
    if (!isEnrolled) {
      toast.info('Please enroll to view these notes');
      setPaymentOpen(true);
      return;
    }
    setSelectedPdf(pdf);
    setPdfViewerOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-4">
        <BookOpen className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">Course not found</p>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }

  const completedVideoIds = user?.completedVideos || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border/30 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Back</span>
        </button>
        <div className="h-4 w-px bg-border" />
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-semibold truncate">{course.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          {isEnrolled ? (
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 px-2.5 py-1 rounded-full font-medium">
              <CheckCircle className="h-3 w-3" /> Enrolled
            </span>
          ) : course.isPaymentPending ? (
            <span className="flex items-center gap-1.5 text-xs text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 px-2.5 py-1 rounded-full font-medium">
              <Clock className="h-3 w-3" /> Verification in Progress (within 12hrs)
            </span>
          ) : (
            <Button size="sm" onClick={handleEnrollClick}>
              Enroll ₹{course.price}/mo
            </Button>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* ── Video Player (left, 2/3) ─────────────────────────────────── */}
          <div className="lg:col-span-2">
            {/* ── PRODUCTION-GRADE PLAYER CONTAINER ── */}
            <div 
              id="player-container"
              className="bg-black rounded-2xl overflow-hidden aspect-video relative mb-4 shadow-2xl group select-none"
              onContextMenu={(e) => e.preventDefault()}
            >
              {/* --- INVISIBLE INTERACTION BLOCKERS --- */}
              
              {/* 1. TOP BLOCKER (Share/Title - right side only to allow play click in center) */}
              <div 
                className="absolute top-0 right-0 w-1/2 h-[60px] z-20 bg-transparent"
                style={{ pointerEvents: 'auto' }}
              />
              
              {/* 2. BOTTOM-RIGHT BLOCKER (YouTube links) */}
              <div 
                className="absolute bottom-0 right-0 w-[140px] h-[60px] z-20 bg-transparent"
                style={{ pointerEvents: 'auto' }}
              />
              
              {/* 3. BOTTOM-LEFT BLOCKER (Logo) */}
              <div 
                className="absolute bottom-0 left-0 w-[100px] h-[50px] z-20 bg-transparent"
                style={{ pointerEvents: 'auto' }}
              />

              {/* Custom Fullscreen Button (over the blocker) */}
              <button
                onClick={toggleFullScreen}
                className="absolute bottom-2 right-2 z-30 p-2 text-white hover:text-white bg-black/60 hover:bg-black/90 backdrop-blur rounded-lg transition-all"
                title="Fullscreen"
              >
                <div className="w-5 h-5 border-2 border-current rounded-sm flex items-center justify-center">
                  <div className={`w-3 h-3 bg-current transition-all ${isFs ? 'scale-50' : 'scale-100'}`} />
                </div>
              </button>

              <AnimatePresence mode="wait">
                {activeVideo?.videoId ? (
                  <motion.div
                    key={activeVideo._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full relative"
                  >
                    <iframe
                      className="w-full h-full relative z-0 pointer-events-auto"
                      src={`https://www.youtube-nocookie.com/embed/${activeVideo.videoId}?modestbranding=1&rel=0&controls=1&disablekb=1&fs=0&iv_load_policy=3&autoplay=1`}
                      title={activeVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="locked"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full flex flex-col items-center justify-center text-white gap-4 relative z-30 bg-black/80 backdrop-blur-md"
                  >
                    <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
                      <Lock className="h-10 w-10 text-white/70" />
                    </div>
                    <div className="text-center px-4">
                      {activeVideo?.isFree && !isLoggedIn ? (
                        <>
                          <p className="font-semibold text-xl mb-1">Login Required</p>
                          <p className="text-white/60 text-sm max-w-xs mx-auto">Please login to watch the free preview video.</p>
                          <Button onClick={() => setAuthOpen(true)} className="mt-4 bg-primary text-white font-bold px-8">
                            Login Now
                          </Button>
                        </>
                      ) : course.isExpired ? (
                        <>
                          <p className="font-semibold text-xl mb-1 text-red-400">Subscription Expired</p>
                          <p className="text-white/60 text-sm max-w-xs mx-auto">Your 30-day access to this course has ended. Renew now to continue learning.</p>
                          <Button onClick={handleEnrollClick} className="mt-4 bg-primary text-white font-bold px-8 py-6 rounded-xl">
                            Renew Subscription ₹{course.price}
                          </Button>
                        </>
                      ) : (
                        <>
                          <p className="font-semibold text-xl mb-1">Lesson Locked</p>
                          <p className="text-white/60 text-sm max-w-xs mx-auto">This is a premium lesson. Enroll in the course to unlock full access.</p>
                          {!course.isPaymentPending && !course.isEnrolled && (
                            <Button onClick={handleEnrollClick} className="mt-4 bg-primary hover:bg-primary/90 text-white font-bold px-8 py-6 rounded-xl shadow-lg shadow-primary/20">
                              Enroll Now ₹{course.price}
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                    {course.isPaymentPending && (
                      <div className="mt-2 px-6 py-3 bg-yellow-500/20 border border-yellow-500/40 rounded-xl text-yellow-400 text-sm font-bold flex flex-col items-center gap-1 animate-pulse">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" /> Verification in Progress...
                        </div>
                        <p className="text-[10px] opacity-80 font-normal">Access will be granted within a few minutes/hours. Check back soon!</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Currently playing info */}
            {activeVideo && (
              <div className="mb-6">
                <h2 className="text-xl font-bold">{activeVideo.title}</h2>
                <div className="flex items-center gap-3 mt-1.5 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{activeVideo.duration}</span>
                  {activeVideo.isFree && (
                    <span className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                      FREE LESSON
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Content Tabs/Sections */}
            <div className="space-y-6">
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-bold text-base mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  About this Course
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">{course.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2.5 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Shield className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Access</p>
                      <p className="font-semibold">30 Days</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Students</p>
                      <p className="font-semibold">{fakeStudents + (course.studentsCount || 0)}+</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Lessons</p>
                      <p className="font-semibold">{course.videos.length} Videos</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* PDF Resources Section */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-bold text-base mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Study Resources
                </h3>
                <div className="grid gap-3">
                  {course.pdfs && course.pdfs.length > 0 ? (
                    course.pdfs.map((pdf) => (
                      <div key={pdf._id} className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-muted/20 hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                            <BookOpen className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{pdf.title}</p>
                            <p className="text-[10px] text-muted-foreground">PDF Document</p>
                          </div>
                        </div>
                        {isEnrolled && pdf.url ? (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-xs font-bold border-primary/30 text-primary hover:bg-primary/10"
                            onClick={() => handlePdfView(pdf)}
                          >
                            Read Online
                          </Button>
                        ) : (
                          <div className="flex items-center gap-2 text-muted-foreground pr-2">
                            <Lock className="h-4 w-4" />
                            <span className="text-[10px] font-bold uppercase tracking-tighter">Locked</span>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground text-sm italic">
                      No study resources available yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Video List (right, 1/3) ──────────────────────────────────── */}
          <div className="space-y-6">
            {/* Enrollment Status/CTA */}
            {!isEnrolled && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card glow-border rounded-2xl p-6 shadow-xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -mr-12 -mt-12 blur-2xl" />
                <div className="text-center mb-6 relative z-10">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-4xl font-black text-primary">₹{course.price}</span>
                    <span className="text-muted-foreground font-bold">/month</span>
                    <span className="text-sm line-through text-muted-foreground ml-2">₹{course.originalPrice}</span>
                  </div>
                  <span className="inline-block text-[10px] bg-green-500/15 text-green-400 border border-green-500/30 px-3 py-1 rounded-full font-black tracking-widest uppercase">
                    Monthly Plan
                  </span>
                </div>
                
                {course.isPaymentPending ? (
                  <Button className="w-full mb-4 py-6 text-yellow-400 border-yellow-400/30 bg-yellow-400/5 hover:bg-yellow-400/10" variant="outline" disabled>
                    <Clock className="h-4 w-4 mr-2 animate-spin" /> Verifying Payment...
                  </Button>
                ) : (
                  <Button className="w-full mb-4 py-6 shadow-xl shadow-primary/20 font-black text-base uppercase tracking-tight" onClick={handleEnrollClick}>
                    Enroll Now ₹{course.price}
                  </Button>
                )}
                
                <div className="space-y-2.5">
                  {['All 10 Premium Video Parts', 'Detailed Solution PDFs', '24/7 Priority Support', '30 Days Full Access'].map((f) => (
                    <div key={f} className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle className="h-2.5 w-2.5 text-emerald-400" />
                      </div>
                      {f}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Video list */}
            <div className="glass-card rounded-2xl overflow-hidden shadow-lg border border-border/10">
              <div className="px-6 py-5 border-b border-border/30 flex items-center justify-between bg-muted/30">
                <div>
                  <h3 className="font-bold text-sm">Course Content</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">10 Modules • {course.duration}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Play className="h-4 w-4 fill-primary" />
                </div>
              </div>
              <div className="divide-y divide-border/10">
                {course.videos
                  .sort((a, b) => a.order - b.order)
                  .map((video) => {
                        const canPlay = !!video.videoId;
                        const isActive = activeVideo?._id === video._id;
                        const isCompleted = completedVideoIds.includes(video.videoId || '');

                        return (
                          <div
                            key={video._id}
                            onClick={() => handleVideoClick(video)}
                            className={`flex items-center gap-4 px-5 py-4 transition-all cursor-pointer group ${
                              isActive ? 'bg-primary/10' : 'hover:bg-muted/50'
                            }`}
                          >
                            {/* Icon */}
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${
                              isActive
                                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                                : isCompleted
                                ? 'bg-emerald-500/15 text-emerald-400'
                                : canPlay
                                ? 'bg-muted text-foreground'
                                : 'bg-muted/30 text-muted-foreground'
                            }`}>
                              {isCompleted ? (
                                <CheckCircle className="h-5 w-5" />
                              ) : canPlay ? (
                                <Play className={`h-4 w-4 ${isActive ? 'fill-current' : ''}`} />
                              ) : (
                                <Lock className="h-4 w-4" />
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-bold truncate ${isActive ? 'text-primary' : 'text-foreground'}`}>
                                {video.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                                  <Clock className="h-3 w-3" /> {video.duration}
                                </span>
                                {video.isFree && (
                                  <span className="text-[9px] bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded font-black tracking-tighter uppercase">FREE</span>
                                )}
                              </div>
                            </div>

                            {isActive && (
                              <motion.div layoutId="active-indicator" className="w-1.5 h-6 bg-primary rounded-full" />
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          </div>

      {/* Modals */}
      {paymentOpen && (
        <PaymentModal
          open={paymentOpen}
          onClose={() => setPaymentOpen(false)}
          courseId={course._id}
          courseTitle={course.title}
          originalPrice={course.originalPrice}
          onSuccess={handlePaymentSuccess}
        />
      )}
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        defaultTab="login"
      />
      {selectedPdf && (
        <SecurePDFModal
          isOpen={pdfViewerOpen}
          onClose={() => setPdfViewerOpen(false)}
          pdfUrl={selectedPdf.url || ''}
          pdfTitle={selectedPdf.title}
        />
      )}
    </div>
  );
};

export default CoursePage;
