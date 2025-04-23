import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuthStore } from "@/lib/auth";
import { useCartStore } from "@/lib/cart";
import PaymentForm from "@/components/payment/payment-form";
import CartSummary from "@/components/cart/cart-summary";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Lock } from "lucide-react";

const PaymentPage = () => {
  const [, navigate] = useLocation();
  const { checkAuthStatus } = useAuthStore();
  const { items } = useCartStore();
  
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);
  
  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart");
    }
  }, [items.length, navigate]);
  
  if (items.length === 0) {
    return null; // Don't render anything while redirecting
  }
  
  return (
    <main className="container mx-auto px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold playfair mb-6">Checkout</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <PaymentForm />
            
            <div className="mt-6 bg-[#F9F6F1] p-4 rounded-sm flex items-center">
              <ShieldCheck className="h-6 w-6 text-[#C8A96A] mr-3" />
              <div>
                <h3 className="font-medium">Secure Payment</h3>
                <p className="text-sm text-gray-600">
                  Your payment information is encrypted and secure.
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <CartSummary showCheckoutButton={false} />
            
            <div className="mt-6 space-y-4">
              <div className="bg-white p-4 rounded-sm shadow-sm">
                <h3 className="font-medium mb-2">Order Summary</h3>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span>
                        {item.productName} × {item.quantity}
                      </span>
                      <span>
                        ${((item.price * item.quantity) / 100).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-sm shadow-sm">
                <h3 className="font-medium mb-2">Shipping Information</h3>
                <p className="text-sm text-gray-600">
                  Standard shipping: 3-5 business days
                </p>
                <p className="text-sm text-gray-600">
                  Express shipping: 1-2 business days (additional charge)
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-sm shadow-sm flex items-start">
                <Lock className="h-4 w-4 text-[#C8A96A] mr-2 mt-0.5" />
                <p className="text-xs text-gray-500">
                  Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/cart")}
          >
            Return to Cart
          </Button>
        </div>
      </div>
    </main>
  );
};

export default PaymentPage;
