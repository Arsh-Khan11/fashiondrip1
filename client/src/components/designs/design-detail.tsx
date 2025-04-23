import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useCartStore } from "@/lib/cart";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SizeSelector from "./size-selector";
import { Star, StarHalf, ChevronLeft, Minus, Plus, ShoppingCart } from "lucide-react";

const DesignDetail = () => {
  const params = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { addItem } = useCartStore();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [isCustomSize, setIsCustomSize] = useState(false);
  
  useEffect(() => {
    const fetchProduct = async () => {
      if (!params.id) {
        navigate("/designs");
        return;
      }
      
      try {
        const response = await fetch(`/api/products/${params.id}`);
        if (!response.ok) {
          throw new Error("Product not found");
        }
        
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive"
        });
        navigate("/designs");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [params.id, navigate, toast]);
  
  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    setIsCustomSize(size === "Custom");
  };
  
  const handleQuantityChange = (value: number) => {
    setQuantity(Math.max(1, quantity + value));
  };
  
  const handleAddToCart = () => {
    if (!product) return;
    
    addItem({
      productId: product.id,
      productName: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity,
      size: selectedSize
    });
    
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} (${selectedSize})`,
    });
  };
  
  // Format price from cents to dollars
  const formatPrice = (priceInCents: number | undefined): string => {
    if (!priceInCents) return "$0.00";
    return `$${(priceInCents / 100).toFixed(2)}`;
  };
  
  // Mock review data
  const mockReviewCount = 27;
  const mockRating = 4.5;
  
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
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 h-[600px] bg-gray-200 animate-pulse"></div>
          <div className="w-full md:w-1/2">
            <div className="h-8 bg-gray-200 w-3/4 mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 w-1/4 mb-6 animate-pulse"></div>
            <div className="h-4 bg-gray-200 w-full mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 w-full mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 w-3/4 mb-8 animate-pulse"></div>
            <div className="h-10 bg-gray-200 w-full mb-4 animate-pulse"></div>
            <div className="h-12 bg-gray-200 w-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <p className="text-lg">Product not found.</p>
        <Button 
          asChild
          className="mt-4"
          variant="outline"
        >
          <a href="/designs">Back to Designs</a>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-10">
      <Button
        variant="ghost"
        size="sm"
        className="mb-6 flex items-center"
        onClick={() => navigate("/designs")}
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Designs
      </Button>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Image */}
        <div className="w-full md:w-1/2">
          <div className="bg-white p-2">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
        
        {/* Product Details */}
        <div className="w-full md:w-1/2">
          <h1 className="playfair text-3xl font-semibold mb-2">{product.name}</h1>
          <p className="text-2xl text-[#C8A96A] font-medium mb-4">{formatPrice(product.price)}</p>
          
          <div className="flex items-center mb-6">
            <div className="flex mr-2">
              {renderStars(mockRating)}
            </div>
            <span className="text-sm text-gray-600">({mockReviewCount} reviews)</span>
          </div>
          
          <p className="text-gray-700 mb-6">{product.description}</p>
          
          {/* Size Selection */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Select Size</h3>
            <SizeSelector 
              selectedSize={selectedSize} 
              onSizeChange={handleSizeChange}
            />
          </div>
          
          {/* Custom Size Fields (shown only if Custom size is selected) */}
          {isCustomSize && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Chest (inches)</label>
                <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Waist (inches)</label>
                <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Hips (inches)</label>
                <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Length (inches)</label>
                <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-sm" />
              </div>
            </div>
          )}
          
          {/* Quantity Selector */}
          <div className="flex items-center mb-6">
            <h3 className="font-medium mr-4">Quantity</h3>
            <div className="flex items-center border border-gray-300">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-none"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{quantity}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-none"
                onClick={() => handleQuantityChange(1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <Button 
            className="w-full py-3 bg-[#C8A96A] hover:bg-[#B08D4C] text-white font-medium rounded-sm h-auto"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>
          
          {/* Product Tabs (Details, Care, etc.) */}
          <div className="mt-10">
            <Tabs defaultValue="details">
              <TabsList className="w-full">
                <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
                <TabsTrigger value="care" className="flex-1">Care Instructions</TabsTrigger>
                <TabsTrigger value="shipping" className="flex-1">Shipping & Returns</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="mt-4 text-gray-700">
                <p>
                  This premium {product.category.toLowerCase()} is part of our {product.collection} collection. 
                  Crafted with meticulous attention to detail and using only the finest materials, 
                  this piece is designed to provide exceptional comfort and style.
                </p>
              </TabsContent>
              <TabsContent value="care" className="mt-4 text-gray-700">
                <p>
                  For best results, dry clean only. Store in a cool, dry place away from direct sunlight.
                  Iron on low heat if necessary. Follow all care instructions on the label.
                </p>
              </TabsContent>
              <TabsContent value="shipping" className="mt-4 text-gray-700">
                <p>
                  Free shipping on all orders over $250. Standard delivery in 3-5 business days.
                  Express shipping available at checkout. 30-day returns policy for unworn items.
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignDetail;
