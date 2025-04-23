import { Star, StarHalf } from "lucide-react";

interface ReviewProps {
  review: {
    id: number;
    name: string;
    position: string;
    rating: number;
    comment: string;
  };
}

const ReviewCard = ({ review }: ReviewProps) => {
  // Generate star rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="text-[#C8A96A] h-5 w-5 fill-[#C8A96A]" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="text-[#C8A96A] h-5 w-5 fill-[#C8A96A]" />);
    }
    
    return stars;
  };
  
  return (
    <div className="bg-white p-8 shadow-sm">
      <div className="flex mb-4">
        {renderStars(review.rating)}
      </div>
      <p className="italic text-gray-700 mb-6">
        "{review.comment}"
      </p>
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
        <div>
          <h4 className="font-medium">{review.name}</h4>
          <p className="text-sm text-gray-500">{review.position}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
