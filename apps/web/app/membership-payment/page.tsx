'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  AuthPageShell,
  authPrimaryButtonClass,
} from '../components/ui/AuthPageShell';

const PAYMENT_AMOUNT = 149;

export default function MembershipPayment() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.membership) {
      router.replace('/');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas text-warm-300">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold/20 border-t-gold" />
      </div>
    );
  }

  if (!session) {
    return (
      <AuthPageShell title="Sign in required" subtitle="Please sign in before completing membership." label="Membership">
        <Link href="/signin" className={`${authPrimaryButtonClass} inline-block text-center`}>
          Go to sign in
        </Link>
      </AuthPageShell>
    );
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
              await update?.();
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
        theme: { color: '#c9a962' },
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
    <AuthPageShell
      title="Activate membership"
      subtitle="Complete a one-time payment to unlock streaming. Razorpay test mode is enabled for demo checkout."
      label="Premium access"
    >
      <div className="rounded-3xl border border-white/[0.08] bg-white/[0.04] p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-warm-500">Plan</p>
        <p className="mt-2 font-display text-2xl text-white">Full catalogue access</p>
        <div className="mt-4 flex items-end justify-between border-t border-white/[0.06] pt-4">
          <span className="text-sm text-warm-400">Total due today</span>
          <span className="font-display text-3xl text-gold-light">₹{PAYMENT_AMOUNT}</span>
        </div>
      </div>

      <ul className="mt-5 space-y-2 text-sm text-warm-300">
        <li className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          Unlimited movies, series & anime
        </li>
        <li className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          HD streaming on all devices
        </li>
        <li className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          Secure checkout via Razorpay
        </li>
      </ul>

      <button
        disabled={loading}
        onClick={handlePayment}
        className={`${authPrimaryButtonClass} mt-8`}
      >
        {loading ? 'Processing…' : `Pay ₹${PAYMENT_AMOUNT}`}
      </button>

      <p className="mt-4 text-center text-xs text-warm-500">
        Test cards work in Razorpay sandbox mode.
      </p>
    </AuthPageShell>
  );
}
