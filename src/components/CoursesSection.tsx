import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import CourseDetailModal from "@/components/CourseDetailModal";

import upsc2 from "@/assets/upsc2.jpg";
import nda2 from "@/assets/nda2.jpg";
import gate2 from "@/assets/gate2.jpg";
import poster7 from "@/assets/poster7.jpg";
import poster8 from "@/assets/poster8.jpg";
import poster9 from "@/assets/poster9.jpg";

const courses = [
  {
    title: "UPSC Foundation",
    price: "₹4,999",
    originalPrice: "₹8,999",
    duration: "6 Months",
    students: "2.5K+",
    desc: "Complete prelims + mains preparation.",
    image: upsc2,
  },
  {
    title: "NDA Crash Course",
    price: "₹2,999",
    originalPrice: "₹5,499",
    duration: "3 Months",
    students: "1.8K+",
    desc: "Mathematics & GAT full syllabus.",
    image: nda2,
  },
  {
    title: "GATE CSE Mastery",
    price: "₹5,499",
    originalPrice: "₹9,999",
    duration: "8 Months",
    students: "1.2K+",
    desc: "Complete CS curriculum.",
    image: gate2,
  },
  {
    title: "SSC CGL Complete",
    price: "₹1,999",
    originalPrice: "₹3,999",
    duration: "4 Months",
    students: "3K+",
    desc: "Tier I & II prep.",
    image: poster7,
  },
  {
    title: "UPSC Optional",
    price: "₹3,499",
    originalPrice: "₹6,499",
    duration: "5 Months",
    students: "800+",
    desc: "Optional subject prep.",
    image: poster8,
  },
  {
    title: "Defence OTA",
    price: "₹2,499",
    originalPrice: "₹4,499",
    duration: "2 Months",
    students: "950+",
    desc: "SSB strategies.",
    image: poster9,
  },
];

const CoursesSection = () => {
  const [selectedCourse, setSelectedCourse] = useState<typeof courses[0] | null>(null);

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

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={course.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.03 }}
              className="bg-white dark:bg-zinc-900 rounded-xl shadow-md overflow-hidden cursor-pointer"
              onClick={() => setSelectedCourse(course)}
            >

              {/* IMAGE */}
              <div className="w-full aspect-[4/3] overflow-hidden rounded-t-xl">
                <motion.img
                  src={course.image}
                  alt={course.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-top scale-95"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-sm md:text-base mb-2">
                  {course.title}
                </h3>

                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {course.desc}
                </p>

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {course.students}
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-sm">
                    {course.price}
                  </span>
                  <span className="text-xs line-through text-muted-foreground">
                    {course.originalPrice}
                  </span>
                </div>

                {/* Button */}
                <Button
                  className="w-full text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCourse(course);
                  }}
                >
                  Enroll Now
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedCourse && (
        <CourseDetailModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </section>
  );
};

export default CoursesSection;