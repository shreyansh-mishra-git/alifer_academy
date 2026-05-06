import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Users, ArrowRight, Lock, Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { apiGetCourses } from "@/lib/api";

// Static fallback images for courses (mapped by index)
import upsc from "@/assets/upsc.jpg";
import nda from "@/assets/nda.jpg";
import gate from "@/assets/gate.jpg";
import denm1 from "@/assets/DENM UNIT 1.jpg";
import denm2 from "@/assets/DENM UNIT 2.jpg";
import denm3 from "@/assets/DENM UNIT 3.jpg";

const FALLBACK_IMAGES = [denm1, nda, gate, upsc, denm2, denm3];

interface CourseCard {
  _id: string;
  title: string;
  price: number;
  originalPrice: number;
  duration: string;
  studentsCount: number;
  description: string;
  image: string;
  videos: Array<{ isFree: boolean; isLocked: boolean }>;
}

interface CoursesSectionProps {
  onAuthRequired?: () => void;
}

const getBaseStudents = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return 100 + (Math.abs(hash) % 51);
};

// Dynamic course naming based on video count
const getCourseName = (course: CourseCard): string => {
  return course.title; 
};

const CoursesSection = ({ onAuthRequired }: CoursesSectionProps) => {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 11, minutes: 45, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) return { ...prev, seconds: seconds - 1 };
        if (minutes > 0) return { ...prev, minutes: minutes - 1, seconds: 59 };
        if (hours > 0) return { ...prev, hours: hours - 1, minutes: 59, seconds: 59 };
        if (days > 0) return { ...prev, days: days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const data = await apiGetCourses();
      setCourses(data);
    } catch {
      // If backend not available, show nothing (graceful degradation)
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = (e: React.MouseEvent, course: CourseCard) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    navigate(`/course/${course._id}`);
  };

  const handleViewCourse = (course: CourseCard) => {
    navigate(`/course/${course._id}`);
  };

  const isEnrolled = (courseId: string) =>
    user?.enrolledCourses?.some((c) => c._id === courseId) ?? false;

  return (
    <section id="courses" className="section-padding">
      <div className="container mx-auto">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Our Courses
          </h2>
          <p className="text-muted-foreground">
            Choose the best course for your preparation
          </p>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Grid */}
        {!loading && courses.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-12 px-4 md:px-0">
            {courses.flatMap((course, originalIndex) => {
              const enrolled = isEnrolled(course._id);
              const freeVideos = course.videos?.filter(v => v.isFree).length || 0;
              const totalVideos = course.videos?.length || 0;
              const discount = Math.round((1 - course.price / course.originalPrice) * 100);
              
              // Determine image based on unit
              let imgSrc = course.image || FALLBACK_IMAGES[originalIndex % FALLBACK_IMAGES.length];
              if (course.title.includes("Unit 1")) imgSrc = denm1;
              if (course.title.includes("Unit 3")) imgSrc = denm3;

              // The actual course + 2 dummy ones
              return [
                // 1. The Actual Course
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: originalIndex * 0.1 }}
                  className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg overflow-hidden cursor-pointer group hover-lift transition-all duration-300"
                  onClick={() => handleViewCourse(course)}
                >
                  <div className="w-full aspect-[4/3] overflow-hidden rounded-t-xl relative">
                    <motion.img
                      src={imgSrc}
                      alt={course.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-top scale-95 group-hover:scale-100 transition-transform duration-500"
                    />
                    {discount > 0 && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {discount}% OFF
                      </div>
                    )}
                    {enrolled && (
                      <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Enrolled ✓
                      </div>
                    )}
                    {freeVideos > 0 && !enrolled && (
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[10px] bg-black/70 text-white px-2 py-0.5 rounded-full">
                        <Play className="h-2.5 w-2.5 fill-current" /> {freeVideos} free preview
                      </div>
                    )}
                    {/* Running Timer */}
                    <div className="absolute bottom-2 right-2 bg-red-600 text-white text-[8px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg">
                      <Clock className="h-2 w-2 animate-spin" /> ENDS SOON: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-base md:text-lg mb-2">{getCourseName(course)}</h3>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-3">
                      <span className="flex items-center gap-1 font-bold"><Clock className="h-2.5 w-2.5" />Access: 30 Days</span>
                      <span className="flex items-center gap-1 font-bold"><Users className="h-2.5 w-2.5" />{getBaseStudents(course._id) + (course.studentsCount || 0)}+ Enrolled</span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="font-bold text-sm text-primary">₹{course.price}</span>
                        <span className="text-[10px] text-muted-foreground ml-1">/month</span>
                      </div>
                      <span className="text-[10px] line-through text-muted-foreground">₹{course.originalPrice}</span>
                    </div>
                    <Button className="w-full text-sm" variant={enrolled ? "outline" : "default"} onClick={(e) => handleEnroll(e, course)}>
                      {enrolled ? <><Play className="mr-1 h-4 w-4 fill-current" /> Continue</> : "Enroll Now"}
                    </Button>
                  </div>
                </motion.div>,

                // 2. Dummy Course A
                <motion.div
                  key={`${course._id}-dummy1`}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg overflow-hidden relative hover-lift transition-all duration-300"
                >
                  <div className="absolute bottom-0 inset-x-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm py-2">
                    <div className="bg-red-600 text-white text-xs font-bold px-5 py-2 rounded-full animate-pulse shadow-lg">
                      BATCH FULL
                    </div>
                  </div>
                  <div className="w-full aspect-[4/3] overflow-hidden rounded-t-xl relative">
                    <img src={imgSrc} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-sm mb-2 text-muted-foreground">
                      {course.title.includes('3.0') ? course.title.replace('3.0', '2.0 (Full)') : course.title + ' (Batch B)'}
                    </h3>
                    <div className="flex items-center justify-between text-[10px] mb-3 opacity-30 font-bold">
                      <span>Access: 30 Days</span>
                      <span>100+ Enrolled</span>
                    </div>
                    <div className="flex items-center justify-between text-xs mb-3 opacity-30">
                      <span>₹{course.price}/month</span>
                      <span className="line-through">₹{course.originalPrice}</span>
                    </div>
                    <Button disabled className="w-full py-6 text-sm font-bold bg-muted/80 uppercase tracking-widest shadow-inner">Batch Full</Button>
                  </div>
                </motion.div>,

                // 3. Dummy Course B
                <motion.div
                  key={`${course._id}-dummy2`}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg overflow-hidden relative hover-lift transition-all duration-300"
                >
                  <div className="absolute bottom-0 inset-x-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm py-2">
                    <div className="bg-red-600 text-white text-xs font-bold px-5 py-2 rounded-full animate-pulse shadow-lg">
                      BATCH FULL
                    </div>
                  </div>
                  <div className="w-full aspect-[4/3] overflow-hidden rounded-t-xl relative">
                    <img src={imgSrc} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-sm mb-2 text-muted-foreground">
                      {course.title.includes('3.0') ? course.title.replace('3.0', '1.0 (Full)') : course.title + ' (Batch A)'}
                    </h3>
                    <div className="flex items-center justify-between text-[10px] mb-3 opacity-30 font-bold">
                      <span>Access: 30 Days</span>
                      <span>100+ Enrolled</span>
                    </div>
                    <div className="flex items-center justify-between text-xs mb-3 opacity-30">
                      <span>₹{course.price}/month</span>
                      <span className="line-through">₹{course.originalPrice}</span>
                    </div>
                    <Button disabled className="w-full py-6 text-sm font-bold bg-muted/80 uppercase tracking-widest shadow-inner">Batch Full</Button>
                  </div>
                </motion.div>
              ];
            })}
          </div>
        )}

        {/* If backend is unreachable — show static fallback message */}
        {!loading && courses.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="mb-2">Courses loading... Make sure the backend is running.</p>
            <Button variant="outline" size="sm" onClick={loadCourses}>
              Retry
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CoursesSection;