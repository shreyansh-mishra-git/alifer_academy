import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import AuthModal from "@/components/AuthModal";
import InfoSection from "@/components/InfoSection";
import DemoVideoSection from "@/components/DemoVideoSection";
import CoursesSection from "@/components/CoursesSection";
import TeacherSection from "@/components/TeacherSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import WhatMakesDifferentSection from "@/components/WhatMakesDifferentSection";
import SuccessStoriesSection from "@/components/SuccessStoriesSection";
import StudentDashboardDemo from "@/components/StudentDashboardDemo";
import PostersCarousel from "@/components/PostersCarousel";
import PromotionModal from "@/components/PromotionModal";
import FooterSection from "@/components/FooterSection";
import ChatbotWidget from "@/components/ChatbotWidget";
import LoadingScreen from "@/components/LoadingScreen";
import HeroSection from "@/components/HeroSection";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const [promoOpen, setPromoOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      // Show promo modal after loading screen is gone
      setTimeout(() => setPromoOpen(true), 800);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const scrollToCourses = () => {
    document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleGetStarted = () => {
    if (!isLoggedIn) {
      setAuthOpen(true);
    } else {
      scrollToCourses();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <LoadingScreen show={loading} />
      <Navbar onGetStarted={handleGetStarted} />

      {/* 1. Full-width hero carousel — above everything */}
      <div id="home">
        <HeroCarousel onEnroll={handleGetStarted} />
      </div>

      {/* 2. Courses section */}
      <CoursesSection onAuthRequired={() => setAuthOpen(true)} />

      {/* 3. Watch how we teach (Demo videos) */}
      <DemoVideoSection />

      {/* 4. Insights (Info / Blog posts) */}
      <InfoSection />

      {/* 5. Learn Smarter section (Moved here) */}
      <HeroSection onExplore={scrollToCourses} onGetStarted={handleGetStarted} />

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
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <PromotionModal 
        isOpen={promoOpen} 
        onClose={() => setPromoOpen(false)} 
        onRegister={handleGetStarted}
      />
    </div>
  );
};

export default Index;
