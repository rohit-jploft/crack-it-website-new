import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = await loadStripe('pk_test_51JefPRSGW6JD7fgQMhBnXAiknyIOyyV6psfUNGTaRkkifq14N7gyYnRsbSFVipTDCExVAZ7uRO7IrnBx8Hu3v6eh006DiAkJCT');