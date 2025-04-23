import { Ruler, Shirt, Video } from "lucide-react";

const Services = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="playfair text-3xl md:text-4xl font-semibold">Our Exclusive Services</h2>
          <div className="w-20 h-1 bg-[#C8A96A] mx-auto mt-4"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Service 1 */}
          <div className="flex flex-col items-center text-center p-6 hover:shadow-lg transition-custom">
            <div className="w-16 h-16 bg-[#F9F6F1] rounded-full flex items-center justify-center mb-5">
              <Ruler className="text-[#C8A96A] h-8 w-8" />
            </div>
            <h3 className="playfair text-xl font-medium mb-3">Personal Tailoring</h3>
            <p className="text-gray-600">Experience custom fittings with our expert tailors directly at your home.</p>
          </div>
          
          {/* Service 2 */}
          <div className="flex flex-col items-center text-center p-6 hover:shadow-lg transition-custom">
            <div className="w-16 h-16 bg-[#F9F6F1] rounded-full flex items-center justify-center mb-5">
              <Shirt className="text-[#C8A96A] h-8 w-8" />
            </div>
            <h3 className="playfair text-xl font-medium mb-3">Luxury Designs</h3>
            <p className="text-gray-600">Browse our exclusive collection of high-end fashion pieces designed for distinction.</p>
          </div>
          
          {/* Service 3 */}
          <div className="flex flex-col items-center text-center p-6 hover:shadow-lg transition-custom">
            <div className="w-16 h-16 bg-[#F9F6F1] rounded-full flex items-center justify-center mb-5">
              <Video className="text-[#C8A96A] h-8 w-8" />
            </div>
            <h3 className="playfair text-xl font-medium mb-3">Virtual Consultations</h3>
            <p className="text-gray-600">Schedule online appointments with our stylists for personalized fashion advice.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
