import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <section className="py-20 bg-black text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="playfair text-3xl md:text-4xl font-semibold">Experience Luxury Fashion Today</h2>
        <p className="max-w-2xl mx-auto mt-4 mb-8">
          Join our exclusive clientele and transform your wardrobe with bespoke designs and personalized services.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button 
            asChild
            className="px-8 py-3 bg-[#C8A96A] hover:bg-[#B08D4C] text-white font-medium transition-custom h-auto rounded-sm"
          >
            <Link href="/designs">Shop Designs</Link>
          </Button>
          <Button 
            asChild
            className="px-8 py-3 border border-white hover:bg-white hover:text-black font-medium transition-custom h-auto rounded-sm bg-transparent"
          >
            <Link href="/signup">Create Account</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
