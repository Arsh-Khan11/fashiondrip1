import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import luxuryBg from "../../assets/luxury-fashion.jpg";

const Hero = () => {
  return (
    <section className="relative h-[700px] md:h-[800px] w-full bg-gray-950 overflow-hidden">
      <div 
        className="absolute inset-0 opacity-90"
        style={{
          backgroundImage: `url(${luxuryBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center 20%"
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
      
      <div className="relative container mx-auto px-6 h-full flex flex-col justify-center">
        <div className="max-w-2xl">
          <div className="w-20 h-1 bg-[#C8A96A] mb-8"></div>
          <h1 className="playfair text-5xl md:text-7xl font-bold leading-tight text-white">
            Elevate Your <br />
            <span className="text-[#C8A96A]">Style & Presence</span>
          </h1>
          
          <p className="text-lg md:text-xl mt-6 max-w-xl font-light text-gray-200">
            Discover our hand-crafted luxury fashion collection and bespoke tailoring services for the modern connoisseur.
          </p>
          
          <div className="flex flex-wrap gap-6 mt-10">
            <Button 
              asChild
              className="px-8 py-6 bg-[#C8A96A] hover:bg-[#B08D4C] text-white font-medium rounded-none transition-all duration-300 h-auto transform hover:translate-x-1"
            >
              <Link href="/booking" className="flex items-center gap-2">
                Book a Tailor <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button 
              asChild
              className="px-8 py-6 border-2 border-white hover:border-[#C8A96A] hover:bg-transparent text-white font-medium rounded-none transition-all duration-300 h-auto bg-transparent hover:text-[#C8A96A]"
            >
              <Link href="/designs">Explore Collection</Link>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent opacity-60"></div>
    </section>
  );
};

export default Hero;
