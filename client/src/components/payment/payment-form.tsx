import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCartStore } from "@/lib/cart";
import { useAuthStore } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { initiateRazorpayPayment, convertToPaise, PaymentResponse } from "@/lib/razorpay";
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
import { CreditCard, CheckCircle2, SmartphoneNfc } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Form validation schema
const paymentFormSchema = z.object({
  fullName: z.string().min(3, { message: "Full name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  phone: z.string().min(10, { message: "Valid phone number is required" }),
  shippingAddress: z.string().min(5, { message: "Shipping address is required" }),
  paymentMethod: z.enum(["card", "upi"]),
  // Card fields (conditionally required)
  cardNumber: z.string().regex(/^\d{16}$/, { message: "Card number must be 16 digits" }).optional(),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: "Expiry date must be in MM/YY format" }).optional(),
  cvv: z.string().regex(/^\d{3,4}$/, { message: "CVV must be 3 or 4 digits" }).optional(),
  // UPI fields (conditionally required)
  upiId: z.string().regex(/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z][a-zA-Z]{2,64}$/, { 
    message: "Enter a valid UPI ID (e.g., yourname@upi)" 
  }).optional(),
}).refine((data) => {
  // If card payment, require card fields
  if (data.paymentMethod === "card") {
    return !!data.cardNumber && !!data.expiryDate && !!data.cvv;
  }
  // If UPI payment, require UPI ID
  if (data.paymentMethod === "upi") {
    return !!data.upiId;
  }
  return true;
}, {
  message: "Please fill in all required payment details",
  path: ["paymentMethod"]
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

const PaymentForm = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { items, getTotal, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState<PaymentResponse | null>(null);
  
  // Format price from cents to dollars
  const formatPrice = (priceInCents: number): string => {
    return `$${(priceInCents / 100).toFixed(2)}`;
  };
  
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      shippingAddress: user?.address || "",
      paymentMethod: "card",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      upiId: "",
    }
  });
  
  const paymentMethod = form.watch("paymentMethod");
  
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
  
  const processRazorpayPayment = async (formData: PaymentFormValues) => {
    try {
      const amount = getTotal();
      const amountInPaise = convertToPaise(amount / 100); // Convert cents to paise
      
      // Common options for both payment methods
      const razorpayOptions: any = {
        amount: amountInPaise,
        currency: "INR",
        name: "Drip It Out",
        description: "Fashion Purchase",
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          address: formData.shippingAddress,
        },
        theme: {
          color: "#C8A96A",
        },
        handler: function (response: any) {
          // This will be called after successful payment
          console.log(response);
        },
      };
      
      // Add UPI-specific options when UPI payment method is selected
      if (formData.paymentMethod === "upi") {
        razorpayOptions.method = {
          upi: {
            flow: "collect",
            vpa: formData.upiId,
          }
        };
      }
      
      const razorpayResponse = await initiateRazorpayPayment(razorpayOptions);
      
      return razorpayResponse;
    } catch (error) {
      console.error("Razorpay payment error:", error);
      throw new Error("Payment processing failed");
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
      // Process payment with Razorpay
      const paymentResponse = await processRazorpayPayment(data);
      setPaymentResponse(paymentResponse);
      
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
            method: data.paymentMethod,
            razorpayPaymentId: paymentResponse.razorpay_payment_id,
            ...(data.paymentMethod === "card" ? {
              lastFour: data.cardNumber?.slice(-4) || "",
            } : {
              upiId: data.upiId
            })
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
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="tel" 
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            field.onChange(value);
                          }}
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
            
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium mb-4">Payment Method</h3>
              
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-gray-50">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="flex items-center cursor-pointer">
                            <CreditCard className="h-5 w-5 mr-2 text-[#C8A96A]" />
                            Credit/Debit Card
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-gray-50">
                          <RadioGroupItem value="upi" id="upi" />
                          <Label htmlFor="upi" className="flex items-center cursor-pointer">
                            <SmartphoneNfc className="h-5 w-5 mr-2 text-[#C8A96A]" />
                            UPI Payment
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="mt-4">
                {paymentMethod === "card" ? (
                  <div className="space-y-4 p-4 border border-gray-200 rounded-md">
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
                  </div>
                ) : (
                  <div className="space-y-4 p-4 border border-gray-200 rounded-md">
                    <FormField
                      control={form.control}
                      name="upiId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>UPI ID</FormLabel>
                          <FormControl>
                            <Input 
                              {...field}
                              placeholder="yourname@upi"
                              required={paymentMethod === "upi"}
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-gray-500 mt-1">
                            Enter your UPI ID (e.g., yourname@okicici, yourname@paytm, yourname@ybl)
                          </p>
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      <img src="https://1000logos.net/wp-content/uploads/2021/03/Paytm_Logo.png" 
                           alt="Paytm" className="h-8 object-contain" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1280px-UPI-Logo-vector.svg.png" 
                           alt="UPI" className="h-8 object-contain" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/512px-Google_Pay_Logo.svg.png" 
                           alt="Google Pay" className="h-8 object-contain" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/2560px-Paytm_Logo_%28standalone%29.svg.png" 
                           alt="PhonePe" className="h-8 object-contain" />
                    </div>
                  </div>
                )}
              </div>
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
                  {paymentMethod === "card" ? (
                    <CreditCard className="mr-2 h-5 w-5" />
                  ) : (
                    <SmartphoneNfc className="mr-2 h-5 w-5" />
                  )}
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
            {paymentResponse && (
              <p className="text-sm mt-2">
                Payment ID: {paymentResponse.razorpay_payment_id}
              </p>
            )}
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
