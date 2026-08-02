"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserSchema, UserType } from "../../types/user";

export default function Signup() {
  const router = useRouter();
  const { data: session, status } = useSession(); // check current browser session
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if the user is already signed in on THIS browser
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  // hook form + zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserType>({
    resolver: zodResolver(UserSchema),
  });

  async function onSubmit(data: UserType) {
    setLoading(true);

    try {
      // 🔹 Normalize email
      const normalizedData = {
        ...data,
        email: data.email.toLowerCase(),
      };

      // Call signup API
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalizedData),
      });

      if (!res.ok) {
        const result = await res.json();
        alert(result.message || "Signup failed");
        setLoading(false);
        return;
      }

      // Auto sign in after signup using normalized email
      const result = await signIn("credentials", {
        email: normalizedData.email, // ✅ use lowercase email here
        password: normalizedData.password,
        redirect: false,
      });

      if (result?.error) {
        alert(result.error);
        setLoading(false);
        return;
      }

      router.push("/membership-payment");
    } catch (err) {
      console.error(err);
      alert("Network error");
      setLoading(false);
    }
  }

  async function handleGoogleSignup() {
    setLoading(true);
    await signIn("google", { callbackUrl: "/redirect-handler" });
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
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mb-2">
                {errors.email.message}
              </p>
            )}

            <div className="relative mb-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full p-3 pr-12 rounded bg-neutral-700 text-white placeholder-gray-400"
                {...register("password")}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute inset-y-0 right-0 px-3 text-gray-300 hover:text-white disabled:cursor-not-allowed"
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={loading}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mb-2">
                {errors.password.message}
              </p>
            )}

            <button
              type="submit"
              className={`w-full bg-red-600 hover:bg-red-700 p-3 rounded font-semibold transition mb-4 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          <div className="w-full flex justify-center mb-1.5 text-gray-400">
            OR
          </div>

          <button
            onClick={handleGoogleSignup}
            aria-label="Sign in with Google"
            className="flex items-center gap-3 bg-[#4285F4] rounded-md p-0.5 pr-3 transition-colors duration-300 hover:bg-[#357ae8] w-full"
            disabled={loading}
          >
            <div className="flex items-center justify-center bg-white w-9 h-9 rounded-l">
              {/* Google icon SVG here */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-5 h-5"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  className="fill-[#4285F4]"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  className="fill-[#34A853]"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  className="fill-[#FBBC05]"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  className="fill-[#EA4335]"
                />
              </svg>
            </div>
            <span className="text-sm text-white tracking-wider">
              Sign up with Google
            </span>
          </button>

          <div className="text-gray-400 flex justify-center mt-5">
            <span className="mx-2">Already have an account?</span>
            <Link href="/signin" className="underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
    >
      <path d="m3 3 18 18" />
      <path d="M10.6 5.2A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a18 18 0 0 1-3 3.8M6.2 6.2C3.7 8.1 2 12 2 12s3.5 7 10 7c1.1 0 2.1-.2 3-.5" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}
