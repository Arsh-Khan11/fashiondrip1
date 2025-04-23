declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number; // in paise (100 paise = ₹1)
  currency: string;
  name: string;
  description: string;
  order_id?: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes?: Record<string, string>;
  theme: {
    color: string;
  };
  handler: (response: any) => void;
}

export interface PaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

export const initiateRazorpayPayment = (options: Omit<RazorpayOptions, 'key'>) => {
  return new Promise<PaymentResponse>((resolve, reject) => {
    try {
      const rzp = new window.Razorpay({
        ...options,
        key: 'rzp_test_UBSWQulaiHzkNh', // This is a test key, replace with actual key in production
        handler: function (response: PaymentResponse) {
          resolve(response);
        },
      });

      rzp.on('payment.failed', function (response: any) {
        reject(response.error);
      });

      rzp.open();
    } catch (error) {
      reject(error);
    }
  });
};

// Helper function to convert price in dollars to paise (for Razorpay)
export const convertToPaise = (dollars: number): number => {
  // Convert dollars to rupees (using a sample conversion rate) and then to paise
  const conversionRate = 75; // Sample USD to INR conversion rate
  const rupees = dollars * conversionRate;
  const paise = Math.round(rupees * 100); // Convert to paise and round to nearest integer
  return paise;
};