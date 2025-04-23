import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth";
import BookingForm from "@/components/booking/booking-form";

const BookingPage = () => {
  const { checkAuthStatus } = useAuthStore();
  
  // Check authentication status when the page loads
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);
  
  return (
    <main className="container mx-auto px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="playfair text-3xl md:text-4xl font-semibold">Book a Personal Tailor</h1>
          <div className="w-20 h-1 bg-[#C8A96A] mx-auto mt-4 mb-6"></div>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Our expert tailors come to your home for measurements, fittings, and adjustments. 
            Experience the luxury of personalized service without leaving your home.
          </p>
        </div>
        
        <div className="bg-white p-8 shadow-sm">
          <BookingForm />
        </div>
        
        <div className="mt-10 bg-[#F9F6F1] p-6">
          <h2 className="playfair text-xl font-medium mb-4">What to Expect</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-[#C8A96A] text-white flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-medium">Confirmation</h3>
                <p className="text-gray-600">
                  After booking, you'll receive a confirmation email with your appointment details.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-[#C8A96A] text-white flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-medium">The Visit</h3>
                <p className="text-gray-600">
                  Our tailor will arrive at your specified address with all the necessary equipment for measurements and consultation.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-[#C8A96A] text-white flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-medium">Follow-Up</h3>
                <p className="text-gray-600">
                  After your session, we'll provide a detailed summary and recommendations for your custom garments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BookingPage;
