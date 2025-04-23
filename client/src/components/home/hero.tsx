import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative h-[600px] md:h-[700px] w-full bg-black overflow-hidden">
      <div 
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
      
      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center text-white">
        <h1 className="playfair text-4xl md:text-6xl font-bold leading-tight max-w-2xl">
          Luxury Fashion <br />
          <span className="text-[#C8A96A]">at Your Doorstep</span>
        </h1>
        <p className="text-lg md:text-xl mt-6 max-w-xl font-light">
          Discover bespoke tailoring services and premium fashion designs customized just for you.
        </p>
        <div className="flex flex-wrap gap-4 mt-8">
          <Button 
            asChild
            className="px-8 py-3 bg-[#C8A96A] hover:bg-[#B08D4C] text-white font-medium rounded-sm transition-custom h-auto"
          >
            <Link href="/booking">Book a Tailor</Link>
          </Button>
          <Button 
            asChild
            className="px-8 py-3 border border-white hover:bg-white hover:text-black font-medium rounded-sm transition-custom h-auto bg-transparent"
          >
            <Link href="/designs">Explore Designs</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
