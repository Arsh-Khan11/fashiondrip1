import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useCartStore } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DISCOUNT_CODES } from "@/lib/constants";
import { Check, X } from "lucide-react";

interface CartSummaryProps {
  showCheckoutButton?: boolean;
}

const CartSummary = ({ showCheckoutButton = true }: CartSummaryProps) => {
  const { items, discountCode, discountPercentage, getSubtotal, getDiscount, getTotal, applyDiscount, removeDiscount } = useCartStore();
  const [discountInput, setDiscountInput] = useState(discountCode || "");
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [discountSuccess, setDiscountSuccess] = useState<boolean>(!!discountCode);
  const [, navigate] = useLocation();

  // Format price from cents to dollars
  const formatPrice = (priceInCents: number): string => {
    return `$${(priceInCents / 100).toFixed(2)}`;
  };

  const handleApplyDiscount = () => {
    const code = discountInput.trim().toUpperCase();
    
    if (!code) {
      setDiscountError("Please enter a discount code");
      setDiscountSuccess(false);
      return;
    }
    
    const percentage = DISCOUNT_CODES[code as keyof typeof DISCOUNT_CODES];
    
    if (!percentage) {
      setDiscountError("Invalid discount code");
      setDiscountSuccess(false);
      return;
    }
    
    applyDiscount(code, percentage);
    setDiscountError(null);
    setDiscountSuccess(true);
  };

  const handleRemoveDiscount = () => {
    removeDiscount();
    setDiscountInput("");
    setDiscountError(null);
    setDiscountSuccess(false);
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      return;
    }
    navigate("/payment");
  };

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const total = getTotal();

  return (
    <div className="bg-[#F9F6F1] p-6 rounded-sm">
      <h2 className="playfair text-xl font-semibold mb-6">Order Summary</h2>
      
      <div className="space-y-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        
        {/* Discount Code Input */}
        <div className="pt-2 pb-4 border-t border-gray-200">
          <label className="block text-sm font-medium mb-2">Discount Code</label>
          
          {!discountSuccess ? (
            <div className="flex space-x-2">
              <Input
                type="text"
                value={discountInput}
                onChange={(e) => setDiscountInput(e.target.value)}
                placeholder="Enter code"
                className="flex-1"
              />
              <Button 
                onClick={handleApplyDiscount}
                className="bg-[#C8A96A] hover:bg-[#B08D4C] text-white"
              >
                Apply
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-green-50 text-green-700 p-2 rounded-sm">
              <div className="flex items-center">
                <Check className="h-4 w-4 mr-2" />
                <span>{discountCode}: {discountPercentage}% off</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemoveDiscount}
                className="h-6 w-6 text-gray-500 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {discountError && (
            <p className="text-red-500 text-sm mt-2">{discountError}</p>
          )}
          
          <p className="text-sm text-muted-foreground mt-2">
            Try codes: WELCOME10, SAVE20, LUXURY15
          </p>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}
        
        <div className="flex justify-between border-t border-gray-200 pt-4">
          <span className="font-medium">Total</span>
          <span className="font-medium">{formatPrice(total)}</span>
        </div>
      </div>
      
      {showCheckoutButton && (
        <Button
          onClick={handleCheckout}
          disabled={items.length === 0}
          className="w-full mt-6 bg-[#C8A96A] hover:bg-[#B08D4C] text-white font-medium h-12"
        >
          Proceed to Checkout
        </Button>
      )}
      
      <div className="mt-4 text-sm text-center text-gray-500">
        <p>Free shipping on all orders over $250</p>
        <p className="mt-1">30-day return policy</p>
      </div>
    </div>
  );
};

export default CartSummary;
