'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';

const PAYMENT_AMOUNT = 149;

export default function MembershipPayment() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Please sign in to make a payment.
      </div>
    );
  }

  function loadRazorpayScript() {
    return new Promise<boolean>((resolve) => {
      if (document.getElementById('razorpay-script')) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  async function handlePayment() {
    setLoading(true);

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert('Failed to load Razorpay SDK.');
      setLoading(false);
      return;
    }

    try {
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: PAYMENT_AMOUNT }),
      });

      const orderData = await orderRes.json();
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY;

      if (!razorpayKey) {
        alert('Razorpay key missing.');
        setLoading(false);
        return;
      }

      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Netflix 2.0',
        description: 'Membership Payment',
        order_id: orderData.id,
        handler: async function (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) {
          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              await fetch('/api/auth/session?update=true'); // force refresh
              window.location.href = '/'; // redirect to homepage
            } else {
              alert('Payment verification failed. Please contact support.');
              setLoading(false);
            }
          } catch (error) {
            console.error('Verification error:', error);
            alert('An error occurred during payment verification.');
            setLoading(false);
          }
        },
        prefill: {
          email: session?.user?.email ?? '',
        },
        theme: {
          color: '#e50914',
        },
      };

      const rzp = new (window as any).Razorpay(options);

      rzp.on('payment.failed', () => {
        alert('Payment failed.');
        setLoading(false);
      });

      rzp.on('modal.dismiss', () => {
        setLoading(false);
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      alert('An error occurred while processing payment.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6">
      <img className="w-35 sm:w-50 sm:m-3" src="/png/series/netflix.png" alt="netflix" />
      <h1 className="flex text-center text-2xl sm:text-3xl my-6 font-semibold">Complete your Netflix membership payment</h1>
      <button
        disabled={loading}
        onClick={handlePayment}
        className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded font-bold disabled:opacity-50"
      >
        {loading ? 'Processing...' : `Pay ₹${PAYMENT_AMOUNT}`}
      </button>
    </div>
  );
}
