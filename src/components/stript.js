import { loadStripe } from '@stripe/stripe-js';

let stripePromise;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe('pk_test_51JefPRSGW6JD7fgQMhBnXAiknyIOyyV6psfUNGTaRkkifq14N7gyYnRsbSFVipTDCExVAZ7uRO7IrnBx8Hu3v6eh006DiAkJCT');
  }
  return stripePromise;
};

export default getStripe;