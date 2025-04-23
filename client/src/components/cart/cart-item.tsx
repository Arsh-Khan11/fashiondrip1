import { useState } from "react";
import { useCartStore, CartItem } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { SIZE_OPTIONS } from "@/lib/constants";
import { Trash2, Minus, Plus } from "lucide-react";

interface CartItemProps {
  item: CartItem;
}

const CartItemComponent = ({ item }: CartItemProps) => {
  const { removeItem, updateQuantity, updateSize } = useCartStore();
  const [isHovered, setIsHovered] = useState(false);

  // Format price from cents to dollars
  const formatPrice = (priceInCents: number): string => {
    return `$${(priceInCents / 100).toFixed(2)}`;
  };

  // Calculate item total
  const itemTotal = item.price * item.quantity;

  return (
    <div 
      className="flex flex-col sm:flex-row border-b border-gray-200 py-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="sm:w-24 sm:h-24 mb-4 sm:mb-0">
        <img 
          src={item.imageUrl} 
          alt={item.productName} 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Product Details */}
      <div className="flex-1 sm:ml-6">
        <div className="flex flex-col sm:flex-row justify-between">
          <div>
            <h3 className="text-lg font-medium playfair">{item.productName}</h3>
            <p className="text-[#C8A96A] font-medium mt-1">{formatPrice(item.price)}</p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              {/* Size Selector */}
              <div className="flex items-center">
                <span className="text-sm mr-2 font-medium">Size:</span>
                <Select 
                  value={item.size} 
                  onValueChange={(value) => updateSize(item.productId, value)}
                >
                  <SelectTrigger className="w-20 h-8">
                    <SelectValue placeholder="Size" />
                  </SelectTrigger>
                  <SelectContent>
                    {SIZE_OPTIONS.map((size) => (
                      <SelectItem key={size} value={size}>{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Quantity Selector */}
              <div className="flex items-center">
                <span className="text-sm mr-2 font-medium">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-sm">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-none"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-none"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-start mt-4 sm:mt-0">
            <p className="text-lg font-medium sm:text-right">
              {formatPrice(itemTotal)}
            </p>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-red-500 ml-4"
              onClick={() => removeItem(item.productId)}
            >
              <Trash2 className="h-5 w-5" />
              <span className="sr-only">Remove item</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemComponent;
