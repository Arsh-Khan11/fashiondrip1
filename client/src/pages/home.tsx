import Hero from "@/components/home/hero";
import Services from "@/components/home/services";
import DesignsPreview from "@/components/home/designs-preview";
import TailorBookingPreview from "@/components/home/tailor-booking-preview";
import Reviews from "@/components/home/reviews";
import CTA from "@/components/home/cta";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth";

const Home = () => {
  const { checkAuthStatus } = useAuthStore();
  
  // Check authentication status when the home page loads
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);
  
  return (
    <main className="flex-grow">
      <Hero />
      <Services />
      <DesignsPreview />
      <TailorBookingPreview />
      <Reviews />
      <CTA />
    </main>
  );
};

export default Home;
