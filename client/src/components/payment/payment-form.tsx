import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCartStore } from "@/lib/cart";
import { useAuthStore } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CreditCard, CheckCircle2 } from "lucide-react";

// Form validation schema
const paymentFormSchema = z.object({
  cardholderName: z.string().min(3, { message: "Cardholder name is required" }),
  cardNumber: z.string().regex(/^\d{16}$/, { message: "Card number must be 16 digits" }),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: "Expiry date must be in MM/YY format" }),
  cvv: z.string().regex(/^\d{3,4}$/, { message: "CVV must be 3 or 4 digits" }),
  shippingAddress: z.string().min(5, { message: "Shipping address is required" }),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

const PaymentForm = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { items, getTotal, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  
  // Format price from cents to dollars
  const formatPrice = (priceInCents: number): string => {
    return `$${(priceInCents / 100).toFixed(2)}`;
  };
  
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      cardholderName: user?.fullName || "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      shippingAddress: user?.address || "",
    }
  });
  
  const handleExpiryDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      let formattedValue = value;
      if (value.length > 2) {
        formattedValue = value.slice(0, 2) + "/" + value.slice(2);
      }
      form.setValue("expiryDate", formattedValue);
    }
  };
  
  const onSubmit = async (data: PaymentFormValues) => {
    if (items.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Add items before proceeding to payment.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would securely submit payment details to Razorpay or other payment gateway
      
      // Process the order in our system
      const orderItems = items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        size: item.size,
        priceAtPurchase: item.price
      }));
      
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          totalAmount: getTotal(),
          discountCode: useCartStore.getState().discountCode,
          discountAmount: useCartStore.getState().getDiscount(),
          shippingAddress: data.shippingAddress,
          status: "paid",
          paymentDetails: {
            method: "credit_card",
            lastFour: data.cardNumber.slice(-4),
            cardholderName: data.cardholderName
          },
          items: orderItems
        }),
      });
      
      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }
      
      // Show success dialog
      setShowSuccessDialog(true);
      
      // Clear the cart
      clearCart();
    } catch (error) {
      console.error('Payment processing error:', error);
      toast({
        title: "Payment Failed",
        description: "There was a problem processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false);
    navigate("/");
  };
  
  if (!isAuthenticated) {
    return (
      <div className="rounded-sm bg-white p-6 shadow-sm">
        <h2 className="text-xl font-medium mb-4">Please Log In to Continue</h2>
        <p className="mb-4">You need to be logged in to complete your purchase.</p>
        <Button 
          onClick={() => navigate("/login")}
          className="bg-[#C8A96A] hover:bg-[#B08D4C] text-white"
        >
          Login
        </Button>
      </div>
    );
  }
  
  return (
    <>
      <div className="rounded-sm bg-white p-6 shadow-sm">
        <h2 className="playfair text-2xl font-semibold mb-6">Payment Details</h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="cardholderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cardholder Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Number</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        maxLength={16}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          field.onChange(value);
                        }}
                        placeholder="1234 5678 9012 3456"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          placeholder="MM/YY"
                          maxLength={5}
                          onChange={(e) => handleExpiryDateInput(e)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cvv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CVV</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          type="password"
                          maxLength={4}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            field.onChange(value);
                          }}
                          placeholder="123"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="shippingAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shipping Address</FormLabel>
                    <FormControl>
                      <Textarea 
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between mb-2">
                <span>Order Total:</span>
                <span className="font-medium">{formatPrice(getTotal())}</span>
              </div>
            </div>
            
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-3 bg-[#C8A96A] hover:bg-[#B08D4C] text-white font-medium h-auto"
            >
              {isSubmitting ? (
                "Processing..."
              ) : (
                <>
                  <CreditCard className="mr-2 h-5 w-5" />
                  Pay {formatPrice(getTotal())}
                </>
              )}
            </Button>
            
            <p className="text-sm text-center text-gray-500 mt-4">
              Your payment information is encrypted and secure.
            </p>
          </form>
        </Form>
      </div>
      
      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center flex flex-col items-center">
              <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
              Payment Successful!
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              Your order has been placed successfully. A confirmation email will be sent to your registered email address.
            </DialogDescription>
          </DialogHeader>
          <div className="text-center">
            <p className="font-medium">Order Number: #{Math.floor(Math.random() * 1000000)}</p>
            <p className="text-sm text-gray-500 mt-2">
              Thank you for shopping with Drip It Out!
            </p>
          </div>
          <div className="flex justify-center mt-4">
            <Button 
              onClick={handleCloseSuccessDialog}
              className="bg-[#C8A96A] hover:bg-[#B08D4C] text-white"
            >
              Continue Shopping
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaymentForm;
