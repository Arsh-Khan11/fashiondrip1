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
      className="product-card group relative overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute top-4 right-4 z-10">
        {product.collection && (
          <div className="bg-[#C8A96A] text-white text-xs px-3 py-1 uppercase tracking-wider font-medium">
            {product.collection}
          </div>
        )}
      </div>
      
      <div className="aspect-w-3 aspect-h-4 relative overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-[400px] object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        <div className={`product-overlay absolute inset-0 bg-gradient-to-b from-transparent to-black/40 ${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity flex items-center justify-center`}>
          <Link href={`/designs/${product.id}`}>
            <Button className="bg-white hover:bg-[#C8A96A] text-[#C8A96A] hover:text-white border border-[#C8A96A] px-6 py-6 rounded-none font-medium transition-all transform hover:scale-105">
              View Details
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="p-5 border-t border-gray-100">
        <h3 className="playfair text-lg font-semibold text-gray-900">{product.name}</h3>
        <div className="flex justify-between items-center mt-2">
          <p className="text-[#C8A96A] font-medium text-lg">{formatPrice(product.price)}</p>
          <div className="flex items-center">
            <div className="flex mr-1">
              {renderStars(mockRating)}
            </div>
            <span className="text-xs text-gray-500">({mockReviewCount})</span>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center">
          <div className="text-xs text-gray-500 uppercase tracking-wider">
            {product.category}
          </div>
          <Link href={`/designs/${product.id}`} className="text-sm font-medium text-[#C8A96A] hover:underline">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
