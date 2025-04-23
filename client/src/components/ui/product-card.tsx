import { useState } from "react";
import { Link } from "wouter";
import { Star, StarHalf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Format price from cents to dollars
  const formatPrice = (priceInCents: number): string => {
    return `$${(priceInCents / 100).toFixed(2)}`;
  };
  
  // Mock review data
  const mockReviewCount = Math.floor(Math.random() * 50) + 5;
  const mockRating = 4 + Math.random();
  
  // Generate star rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="text-[#C8A96A] h-4 w-4 fill-[#C8A96A]" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="text-[#C8A96A] h-4 w-4 fill-[#C8A96A]" />);
    }
    
    return stars;
  };
  
  return (
    <div 
      className="product-card group relative overflow-hidden bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-w-3 aspect-h-4 relative overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-[400px] object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        <div className={`product-overlay absolute inset-0 bg-black bg-opacity-20 ${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity flex items-center justify-center`}>
          <Link href={`/designs/${product.id}`}>
            <Button className="bg-[#C8A96A] hover:bg-[#B08D4C] text-white px-6 py-2 rounded-sm transition-custom">
              Quick View
            </Button>
          </Link>
        </div>
      </div>
      <div className="p-4">
        <h3 className="playfair text-lg font-medium">{product.name}</h3>
        <p className="text-[#C8A96A] font-medium mt-1">{formatPrice(product.price)}</p>
        <div className="flex items-center mt-2">
          <div className="flex">
            {renderStars(mockRating)}
          </div>
          <span className="text-xs text-gray-500 ml-2">({mockReviewCount} reviews)</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
