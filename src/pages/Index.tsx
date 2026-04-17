import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import HeroSection from "@/components/HeroSection";
import SignInModal from "@/components/SignInModal";
import InfoSection from "@/components/InfoSection";
import DemoVideoSection from "@/components/DemoVideoSection";
import CoursesSection from "@/components/CoursesSection";
import TeacherSection from "@/components/TeacherSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import WhatMakesDifferentSection from "@/components/WhatMakesDifferentSection";
import SuccessStoriesSection from "@/components/SuccessStoriesSection";
import StudentDashboardDemo from "@/components/StudentDashboardDemo";
import PostersCarousel from "@/components/PostersCarousel";
import FooterSection from "@/components/FooterSection";
import ChatbotWidget from "@/components/ChatbotWidget";
import LoadingScreen from "@/components/LoadingScreen";

const Index = () => {
  const [signInOpen, setSignInOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  const scrollToCourses = () => {
    document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <LoadingScreen show={loading} />
      <Navbar onGetStarted={() => setSignInOpen(true)} />

      {/* 1. Full-width hero carousel — above everything */}
      <div id="home">
        <HeroCarousel onEnroll={() => setSignInOpen(true)} />
      </div>

      {/* 2. Original hero section (stats + CTAs) */}
      <HeroSection onExplore={scrollToCourses} onGetStarted={() => setSignInOpen(true)} />

      {/* 3. Info / Blog posts */}
      <InfoSection />

      {/* 4. Demo videos */}
      <DemoVideoSection />

      {/* 5. Courses */}
      <CoursesSection />

      {/* 6. Teacher section BELOW courses (moved from top) */}
      <TeacherSection />

      {/* 7. Why choose us */}
      <WhyChooseUsSection />

      {/* 8. What makes us different */}
      <WhatMakesDifferentSection />

      {/* 9. Student dashboard demo */}
      <StudentDashboardDemo />

      {/* 10. Success stories */}
      <SuccessStoriesSection />

      {/* 11. Posters carousel */}
      <PostersCarousel />

      {/* 12. Footer */}
      <FooterSection />

      <ChatbotWidget />
      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
    </div>
  );
};

export default Index;
