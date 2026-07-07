import Razorpay from 'razorpay';

const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_mockKeyId12345';
const keySecret = process.env.RAZORPAY_KEY_SECRET || 'mockKeySecret12345';

const razorpay = new Razorpay({
  key_id: keyId,
  key_secret: keySecret
});

export default razorpay;
