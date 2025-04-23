import { Link } from "wouter";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookingForm from "@/components/booking/booking-form";

const TailorBookingPreview = () => {
  return (
    <section id="booking" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="playfair text-3xl md:text-4xl font-semibold">Book a Personal Tailor</h2>
            <div className="w-20 h-1 bg-[#C8A96A] mt-4 mb-6"></div>
            <p className="text-gray-700 mb-8">
              Our expert tailors come to your home for measurements, fittings, and adjustments. Enjoy the convenience of personalized tailoring services without leaving your home.
            </p>
            
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-[#F9F6F1] flex items-center justify-center mr-4">
                  <Check className="text-[#C8A96A] h-5 w-5" />
                </div>
                <p className="font-medium">Experienced master tailors</p>
              </div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-[#F9F6F1] flex items-center justify-center mr-4">
                  <Check className="text-[#C8A96A] h-5 w-5" />
                </div>
                <p className="font-medium">Precise measurements and fittings</p>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#F9F6F1] flex items-center justify-center mr-4">
                  <Check className="text-[#C8A96A] h-5 w-5" />
                </div>
                <p className="font-medium">Luxury at your convenience</p>
              </div>
            </div>
            
            <Button 
              asChild
              className="px-8 py-3 bg-[#C8A96A] hover:bg-[#B08D4C] text-white font-medium transition-custom h-auto rounded-sm"
            >
              <Link href="/booking">Book Full Consultation</Link>
            </Button>
          </div>
          
          <div className="bg-[#F9F6F1] p-8">
            <h3 className="playfair text-xl font-medium mb-6">Schedule Your Appointment</h3>
            <BookingForm isPreview={true} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TailorBookingPreview;
