import { useEffect } from "react";
import { Link } from "wouter";
import { useAuthStore } from "@/lib/auth";
import { useCartStore } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import CartItemComponent from "@/components/cart/cart-item";
import CartSummary from "@/components/cart/cart-summary";
import { ShoppingCart, ChevronLeft } from "lucide-react";

const CartPage = () => {
  const { checkAuthStatus } = useAuthStore();
  const { items } = useCartStore();
  
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);
  
  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold playfair mb-6">Shopping Cart</h1>
      
      <Button
        variant="ghost"
        size="sm"
        className="mb-6 flex items-center"
        asChild
      >
        <Link href="/designs">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Continue Shopping
        </Link>
      </Button>
      
      {items.length === 0 ? (
        <div className="bg-white p-10 text-center rounded-sm shadow-sm">
          <div className="flex justify-center mb-4">
            <ShoppingCart className="h-16 w-16 text-gray-300" />
          </div>
          <h2 className="text-xl font-medium mb-2">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Button 
            asChild
            className="bg-[#C8A96A] hover:bg-[#B08D4C] text-white font-medium"
          >
            <Link href="/designs">Explore Designs</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-sm shadow-sm">
              <div className="flex justify-between pb-4 border-b border-gray-200">
                <h2 className="text-lg font-medium">Items ({items.length})</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => useCartStore.getState().clearCart()}
                >
                  Clear Cart
                </Button>
              </div>
              
              <div>
                {items.map((item) => (
                  <CartItemComponent key={item.productId} item={item} />
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>
      )}
    </main>
  );
};

export default CartPage;
