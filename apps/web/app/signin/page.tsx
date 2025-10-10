'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserSchema, UserType } from '../../types/user';
import Image from 'next/image';

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // hook form + zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserType>({
    resolver: zodResolver(UserSchema),
  });

  async function onSubmit(data: UserType) {
    setError(null);
    setLoading(true);

    const res = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    setLoading(false);

    if (res?.error) {
      if (res.error === "You don't have a membership of Netflix") {
        router.push('/membership-payment');
        return;
      }

      if (res.error === "User does not exist") {
        setError("User with this email/phone does not exist. Please sign up.");
        return;
      }

      setError(res.error);
      return;
    }

    // check membership after login
    const sessionRes = await fetch('/api/auth/session');
    const sessionData = await sessionRes.json();

    if (sessionData?.user?.membership) {
      router.push('/');
    } else {
      router.push('/membership-payment');
    }
  }

  async function handleGoogleSignIn() {
    setLoading(true);
    await signIn('google', { callbackUrl: '/redirect-handler' });
  }

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      {/* Background */}
      <Image
        src="/background/backgroundImage2.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="absolute inset-0 bg-black opacity-60 z-10" />
      <Image
        className="absolute top-6 left-10 z-20"
        src="/png/series/netflix.png"
        alt="Netflix"
        width={150}
      />

      {/* Form */}
      <div className="flex items-center justify-center h-full z-20 relative">
        <div className="bg-black/60 text-white p-8 rounded-md w-full max-w-sm">
          <h1 className="text-2xl font-semibold mb-6">Sign In</h1>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-2">
              <input
                type="text"
                placeholder="Email or Phone"
                className="w-full p-3 rounded bg-neutral-700 text-white placeholder-gray-400"
                {...register('email')}
                disabled={loading}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="mb-4">
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 rounded bg-neutral-700 text-white placeholder-gray-400"
                {...register('password')}
                disabled={loading}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {error && (
              <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
            )}

            <button
              type="submit"
              className={`w-full bg-red-600 hover:bg-red-700 p-3 rounded font-semibold transition mb-4 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="w-full flex justify-center mb-1.5 text-gray-400">OR</div>

          <button
            onClick={handleGoogleSignIn}
            aria-label="Sign in with Google"
            className="flex items-center gap-3 bg-[#4285F4] rounded-md p-0.5 pr-3 transition-colors duration-300 hover:bg-[#357ae8] w-full"
            disabled={loading}
          >
            <div className="flex items-center justify-center bg-white w-9 h-9 rounded-l">
              {/* Google icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" className="fill-[#4285F4]" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" className="fill-[#34A853]" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" className="fill-[#FBBC05]" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" className="fill-[#EA4335]" />
              </svg>
            </div>
            <span className="text-sm text-white tracking-wider">Sign in with Google</span>
          </button>

          <div className="text-gray-400 flex justify-center mt-5">
            <span className="mx-2">New to Netflix?</span>
            <Link href="/signup" className="underline">Sign up now</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
