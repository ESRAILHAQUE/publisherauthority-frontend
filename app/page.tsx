"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { WhatIsContentManagerSection } from "@/components/home/WhatIsContentManagerSection";
import { BlogAmplifiedSection } from "@/components/home/BlogAmplifiedSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { HowMuchCanYouMakeSection } from "@/components/home/HowMuchCanYouMakeSection";
import { StartEarningTodaySection } from "@/components/home/StartEarningTodaySection";
import { FAQSection } from "@/components/home/FAQSection";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <HeroSection />
      <WhatIsContentManagerSection />
      <BlogAmplifiedSection />
      <HowItWorksSection />
      <HowMuchCanYouMakeSection />
      <StartEarningTodaySection />
      <FAQSection />
      <Footer />
    </div>
  );
}