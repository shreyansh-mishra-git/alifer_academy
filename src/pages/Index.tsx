import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SignInModal from "@/components/SignInModal";
import InfoSection from "@/components/InfoSection";
import TeacherSection from "@/components/TeacherSection";
import DemoVideoSection from "@/components/DemoVideoSection";
import CoursesSection from "@/components/CoursesSection";
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
      <HeroSection onExplore={scrollToCourses} onGetStarted={() => setSignInOpen(true)} />
      <InfoSection />
      <TeacherSection />
      <DemoVideoSection />
      <CoursesSection />
      <WhyChooseUsSection />
      <WhatMakesDifferentSection />
      <StudentDashboardDemo />
      <SuccessStoriesSection />
      <PostersCarousel />
      <FooterSection />
      <ChatbotWidget />
      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
    </div>
  );
};

export default Index;
