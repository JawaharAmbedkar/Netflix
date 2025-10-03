'use client';
import { useState, useRef, useEffect } from 'react';
import ProfileSidebar from "./profileSideBar";
import SearchBar from "./search";
import Link from 'next/link';

export const Navbar = () => {
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close notification dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="flex justify-between items-center py-5 px-8 pb-2 w-full ">
      
      {/* -------- Mobile Navbar (<sm) -------- */}
      <div className="flex justify-between items-center w-full sm:hidden">
        <Link href={"/"}>
          <img
            src="/png/series/netflix.png"
            alt="netflix"
            className="w-[70px] mr-8 sm:w-[90px] sm:mr-5"
          />
        </Link>

        {/* Mobile Right: Search + Bell + Profile */}
        <div className="w-[220px] flex items-center relative m:w-[300px]">
          <SearchBar />

          {/* Notification Bell */}
          <div className="ml-3 relative" ref={notifRef}>
            <div
              onClick={() => setNotifOpen(!notifOpen)}
              className="cursor-pointer text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 
                    8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 
                    0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
              </svg>
            </div>

            {/* Dropdown */}
            <div className={`
              absolute right-0 mt-2 w-52 bg-black text-white rounded-lg shadow-lg transition-all duration-300 ease-out z-50
              transform origin-top-right
              ${notifOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
            `}>
              <div className="p-4 border-b border-gray-700 font-medium text-center">
                No notifications
              </div>
            </div>
          </div>

          <ProfileSidebar />
        </div>
      </div>

      {/* -------- Desktop Navbar (≥sm) -------- */}
      <div className="hidden sm:flex justify-between items-center w-full">
        {/* Left: Logo + Nav Links */}
        <div className="flex items-center">
          <Link href={"/"}>
            <img
              src="/png/series/netflix.png"
              alt="netflix"
              className="w-[100px] mr-5 lg:w-[120px] lg:mr-8"
            />
          </Link>

          <ul className="flex space-x-3 text-white text-xs font-bold mt-1 md:space-x-5 md:text-sm lg:space-x-10 lg:text-lg">
            <li><Link href={"/Homepage"}>Home</Link></li>
            <li><Link href={"/Tv-Show"}>Tv shows</Link></li>
            <li><Link href={"/Movies"}>Movies</Link></li>
            <li><Link href={"/Anime"}>Anime</Link></li>
          </ul>
        </div>

        {/* Right: Search + Bell + Profile */}
        <div className="w-[240px] flex items-center relative m:w-[300px]">
          <SearchBar />

          <div className="ml-3 relative" ref={notifRef}>
            <div
              onClick={() => setNotifOpen(!notifOpen)}
              className="cursor-pointer text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 
                    8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 
                    8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 
                    1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 
                    0a3 3 0 1 1-5.714 0" />
              </svg>
            </div>

            <div className={`
              absolute right-0 mt-2 w-52 bg-black text-white rounded-lg shadow-lg transition-all duration-300 ease-out z-50
              transform origin-top-right
              ${notifOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
            `}>
              <div className="p-4 border-b border-gray-700 font-medium text-center">
                No notifications
              </div>
            </div>
          </div>

          <ProfileSidebar />
        </div>
      </div>
    </div>
  );
};
