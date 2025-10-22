'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserSchema, UserType } from '../../types/user';

export default function Signup() {
  const router = useRouter();
  const { data: session, status } = useSession(); // check current browser session
  const [loading, setLoading] = useState(false);

  // Redirect if the user is already signed in on THIS browser
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  // hook form + zod
  const { register, handleSubmit, formState: { errors } } = useForm<UserType>({
    resolver: zodResolver(UserSchema),
  });

  async function onSubmit(data: UserType) {
    setLoading(true);

    try {
      // Call signup API
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const result = await res.json();
        alert(result.message || 'Signup failed');
        setLoading(false);
        return;
      }

      // Auto sign in after signup
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        alert(result.error);
        setLoading(false);
        return;
      }

      router.push('/membership-payment');
    } catch (err) {
      console.error(err);
      alert('Network error');
      setLoading(false);
    }
  }

  async function handleGoogleSignup() {
    setLoading(true);
    await signIn('google', { callbackUrl: '/redirect-handler' });
  }

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      {/* Background */}
      <img
        src="/background/backgroundImage2.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="absolute inset-0 bg-black opacity-60 z-10" />
      <img
        className="absolute top-6 left-10 z-20"
        src="/png/series/netflix.png"
        alt="Netflix"
        width={150}
      />

      {/* Form */}
      <div className="flex items-center justify-center h-full z-20 relative">
        <div className="bg-black/60 text-white p-8 rounded-md w-full max-w-sm">
          <h1 className="text-2xl font-semibold mb-6">Sign Up</h1>

          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="text"
              placeholder="Email"
              className="w-full p-3 rounded bg-neutral-700 text-white placeholder-gray-400 mb-2"
              {...register('email')}
            />
            {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email.message}</p>}

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded bg-neutral-700 text-white placeholder-gray-400 mb-2"
              {...register('password')}
            />
            {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password.message}</p>}

            <button
              type="submit"
              className={`w-full bg-red-600 hover:bg-red-700 p-3 rounded font-semibold transition mb-4 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>

          <div className="w-full flex justify-center mb-1.5 text-gray-400">OR</div>

          <button
            onClick={handleGoogleSignup}
            aria-label="Sign in with Google"
            className="flex items-center gap-3 bg-[#4285F4] rounded-md p-0.5 pr-3 transition-colors duration-300 hover:bg-[#357ae8] w-full"
            disabled={loading}
          >
            <div className="flex items-center justify-center bg-white w-9 h-9 rounded-l">
              {/* Google icon SVG here */}
            </div>
            <span className="text-sm text-white tracking-wider">Sign up with Google</span>
          </button>

          <div className="text-gray-400 flex justify-center mt-5">
            <span className="mx-2">Already have an account?</span>
            <Link href="/signin" className="underline">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
