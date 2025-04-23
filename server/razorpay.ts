// Razorpay integration for server
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay instance with API keys from environment variables
const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

if (!razorpayKeyId || !razorpayKeySecret) {
  console.warn('Razorpay API keys not found in environment variables');
}

export const razorpay = new Razorpay({
  key_id: razorpayKeyId || '',
  key_secret: razorpayKeySecret || '',
});

// Create a Razorpay order
export const createRazorpayOrder = async (amount: number, currency: string = 'INR', receipt: string = 'order_receipt', notes: any = {}) => {
  try {
    const options = {
      amount: amount, // amount in smallest currency unit (paise for INR)
      currency,
      receipt,
      notes,
      payment_capture: 1 // Auto-capture payment
    };
    
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw new Error('Failed to create payment order');
  }
};

// Verify payment signature
export const verifyPaymentSignature = (razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string) => {
  try {
    const generated_signature = crypto
      .createHmac('sha256', razorpayKeySecret || '')
      .update(razorpayOrderId + '|' + razorpayPaymentId)
      .digest('hex');
    
    return generated_signature === razorpaySignature;
  } catch (error) {
    console.error('Error verifying payment signature:', error);
    return false;
  }
};