'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const PAYMENT_AMOUNT = 149;

export default function MembershipPayment() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Redirect if already has membership
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.membership) {
      router.replace('/');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  if (!session) {
    return <div className="min-h-screen flex items-center justify-center text-white">Please sign in to make a payment.</div>;
  }

  const loadRazorpayScript = () =>
    new Promise<boolean>((resolve) => {
      if (document.getElementById('razorpay-script')) return resolve(true);

      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async () => {
    setLoading(true);

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert('Failed to load Razorpay SDK.');
      setLoading(false);
      return;
    }

    try {
      // Create order
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: PAYMENT_AMOUNT }),
      });

      if (!orderRes.ok) throw new Error('Order creation failed');
      const orderData = await orderRes.json();

      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!razorpayKey) throw new Error('Razorpay key missing');

      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Netflix 2.0',
        description: 'Membership Payment',
        order_id: orderData.id,
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              await update?.(); // refresh session
              router.push('/');
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          } catch (err) {
            console.error('Error during payment verification:', err);
            alert('An error occurred during payment verification.');
          } finally {
            setLoading(false);
          }
        },
        prefill: { email: session.user.email ?? '' },
        theme: { color: '#e50914' },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', (err: any) => {
        console.error('Payment failed:', err);
        alert('Payment failed. Please try again.');
        setLoading(false);
      });
      rzp.on('modal.dismiss', () => setLoading(false));
      rzp.open();
    } catch (err) {
      console.error('Error while processing payment:', err);
      alert('Error while processing payment.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6">
      <img className="w-36 sm:w-48 sm:m-3" src="/png/series/netflix.png" alt="Netflix" />
      <h1 className="text-2xl sm:text-3xl font-semibold my-6 text-center">
        Complete your Netflix membership payment
      </h1>
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
