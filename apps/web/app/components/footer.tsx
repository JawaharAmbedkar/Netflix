'use client';

import Link from 'next/link';
import { FC } from 'react';

const Footer: FC = () => {
  return (
    <footer className="text-white text-center py-6 rounded-lg mt-8">
      <div className="flex justify-center space-x-10 sm:space-x-30">
        {/* Home Icon */}
        <Link href="/" className="cursor-pointer hover:text-red-500 transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 
              .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 
              0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 
              3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 
              1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 
              1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 
              0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 
              1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 
              1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 
              0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 
              0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
            />
          </svg>
        </Link>

        {/* Anime Icon */}
        <Link href="/Anime" className="cursor-pointer hover:text-red-500 transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"
            />
          </svg>
        </Link>

        {/* TV Shows Icon */}
        <Link href="/Tv-Show" className="cursor-pointer hover:text-red-500 transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
          </svg>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
