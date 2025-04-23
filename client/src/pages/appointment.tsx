import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth";
import AppointmentForm from "@/components/appointment/appointment-form";
import { Video } from "lucide-react";

const AppointmentPage = () => {
  const { checkAuthStatus } = useAuthStore();
  
  // Check authentication status when the page loads
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);
  
  return (
    <main className="container mx-auto px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="playfair text-3xl md:text-4xl font-semibold">Virtual Styling Consultation</h1>
          <div className="w-20 h-1 bg-[#C8A96A] mx-auto mt-4 mb-6"></div>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Connect with our expert stylists from the comfort of your home. 
            Get personalized fashion advice, style recommendations, and product suggestions tailored to your preferences.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
          <div className="md:col-span-2 flex flex-col justify-center">
            <div className="bg-[#F9F6F1] p-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 mx-auto">
                <Video className="text-[#C8A96A] h-8 w-8" />
              </div>
              
              <h2 className="playfair text-xl font-medium mb-4 text-center">Benefits of Virtual Consultation</h2>
              
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-[#C8A96A] font-bold mr-2">•</span>
                  <span>Personalized style recommendations from professional stylists</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#C8A96A] font-bold mr-2">•</span>
                  <span>Save time with convenient online appointments</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#C8A96A] font-bold mr-2">•</span>
                  <span>Expert advice on selecting the right pieces for your body type</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#C8A96A] font-bold mr-2">•</span>
                  <span>Wardrobe organization tips and styling guidance</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#C8A96A] font-bold mr-2">•</span>
                  <span>Access to exclusive designs and pre-release collections</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="md:col-span-3 bg-white p-8 shadow-sm">
            <h2 className="playfair text-xl font-medium mb-6">Schedule Your Appointment</h2>
            <AppointmentForm />
          </div>
        </div>
        
        <div className="bg-[#F9F6F1] p-6">
          <h2 className="playfair text-xl font-medium mb-4 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-[#C8A96A] text-white flex items-center justify-center mx-auto mb-3">
                1
              </div>
              <h3 className="font-medium mb-2">Book</h3>
              <p className="text-gray-600 text-sm">
                Fill out the form with your preferred date and time for the virtual consultation.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-[#C8A96A] text-white flex items-center justify-center mx-auto mb-3">
                2
              </div>
              <h3 className="font-medium mb-2">Prepare</h3>
              <p className="text-gray-600 text-sm">
                Upload reference images or details about your style preferences before the appointment.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-[#C8A96A] text-white flex items-center justify-center mx-auto mb-3">
                3
              </div>
              <h3 className="font-medium mb-2">Connect</h3>
              <p className="text-gray-600 text-sm">
                Join the video call at your scheduled time to meet with your personal stylist.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AppointmentPage;
