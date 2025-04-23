import { useEffect, useState } from "react";
import ReviewCard from "@/components/ui/review-card";

// Sample testimonials
const sampleTestimonials = [
  {
    id: 1,
    name: "Michael Thompson",
    position: "Executive, New York",
    rating: 5,
    comment: "The tailor service was exceptional. They came to my home, took precise measurements, and delivered a perfectly fitted suit. Couldn't be happier with the experience."
  },
  {
    id: 2,
    name: "Sophia Rodriguez",
    position: "Art Director, Los Angeles",
    rating: 5,
    comment: "I ordered a custom evening gown for a charity gala. The design was breathtaking, and the fit was impeccable. Their attention to detail truly sets them apart."
  },
  {
    id: 3,
    name: "James Wilson",
    position: "Entrepreneur, Chicago",
    rating: 4.5,
    comment: "The virtual consultation was so convenient. Their style expert helped me choose the perfect pieces for my wardrobe refresh, and everything fit beautifully."
  }
];

const Reviews = () => {
  const [testimonials, setTestimonials] = useState(sampleTestimonials);
  
  return (
    <section className="py-16 bg-[#F9F6F1]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="playfair text-3xl md:text-4xl font-semibold">Customer Testimonials</h2>
          <div className="w-20 h-1 bg-[#C8A96A] mx-auto mt-4"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <ReviewCard key={testimonial.id} review={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
