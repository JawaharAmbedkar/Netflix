"use client";

import { useEffect, useRef, useState } from "react";
import { Navbar } from "../components/navbar";
import { anime } from "../videos/Anime/anime";
import { movies } from "../videos/Movies/movies";
import { videos } from "../videos/Top Searches/video";
import { tvshows } from "../videos/Tv Shows/tvshow";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Homepage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Move hooks here, always called in the same order
  const [showPoster, setShowPoster] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/signin");
    } else if (!session.user.membership) {
      router.push("/membership-payment");
    }
  }, [status, session, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPoster(false);
      videoRef.current?.play();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Early returns after hooks
  if (status === "loading" || !session || !session.user.membership) {
    return <div className="text-white p-10 text-center">Checking access...</div>;
  }

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Background image with blur */}
      <img
        src="/background/backgroundImage.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      {/* Optional dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md z-0" />

      {/* Main content above background */}
      <div className="relative z-10">
        <Navbar />

        <div id="mainVideo" className="min-h-screen p-4">
          <div className="grid grid-cols-5 gap-4">
            {/* Left side: Main Video & Sliders */}
            <div className="col-span-5 lg:col-span-4">
              {/* Hero Banner */}
              <div className="relative h-[62vh] rounded-lg overflow-hidden mb-6">
                <Link href="https://www.youtube.com/watch?v=_InqQJRqGW4&ab_channel=Netflix">
                  <video
                    ref={videoRef}
                    src="/main-video/money_heist.mp4"
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                  />

                  {/* Poster image overlay */}
                  {showPoster && (
                    <img
                      src="/Main-video/Money-Heist.jpg"
                      alt="Series Poster"
                      className="absolute top-0 left-0 w-full h-full object-cover z-10 transition-opacity duration-1000"
                    />
                  )}

                  {/* PNG Logo Overlay */}
                  <div className="relative">
                    {/* Overlay Wrapper */}
                    <div
                      className="absolute z-20 p-3 rounded-md
               bottom-10 sm:bottom-0 
               right-[-10.5] 
               w-full sm:w-[80%] md:w-[500px] lg:w-[500px]"
                    >
                      {/* Logo Image */}
                      <img
                        src="/png/series/series.png"
                        alt="Series Logo"
                        className="w-full brightness-125"
                      />

                      {/* Paragraph */}
                      <p
                        className="hidden sm:block text-xs sm:text-sm md:text-base xl:text-lg text-white mt-3 font-light backdrop-blur-md leading-relaxed"
                      >
                        When the national mint and a touring school group are held hostage by robbers,
                        police believe that the thieves have no way out. Little do they know that the
                        thieves have a bigger plan in store.
                      </p>
                    </div>
                  </div>

                </Link>
              </div>

              <div>
                <div className="mt-10"></div>

                <Link href="/Tv-Show">
                  <div className="flex font-bold text-2xl my-2">TV SHOWS</div>
                </Link>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {tvshows.map((tvshow) => (
                    <a
                      key={tvshow.id}
                      href={tvshow.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:scale-105 transition-transform"
                    >
                      <div className="w-full aspect-video rounded-lg overflow-hidden shadow">
                        <img
                          src={tvshow.thumbnail}
                          alt={tvshow.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </a>
                  ))}
                </div>
              </div>


              <div className="mt-10">
                <Link href="/Movies">
                  <div className="flex font-bold text-2xl my-2">MOVIES</div>
                </Link>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {movies.map((movie) => (
                    <a
                      key={movie.id}
                      href={movie.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:scale-105 transition-transform"
                    >
                      <div className="w-full aspect-video rounded-lg overflow-hidden shadow">
                        <img
                          src={movie.thumbnail}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="mt-10">
                <Link href="/Anime">
                  <div className="flex font-bold text-2xl my-2">ANIME</div>
                </Link>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {anime.map((anime) => (
                    <a
                      key={anime.id}
                      href={anime.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:scale-105 transition-transform"
                    >
                      <div className="w-full aspect-video rounded-lg overflow-hidden shadow">
                        <img
                          src={anime.thumbnail}
                          alt={anime.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </a>
                  ))}
                </div>
              </div>

            </div>

            {/* Right side: Top Searches */}
            <div className="col-span-1 p-4 border-l overflow-y-auto hidden lg:block">
              <h2 className="text-2xl font-bold mb-4 text-center">TOP SEARCHES</h2>
              <div className="flex flex-col gap-11">
                {videos.map((video) => (
                  <a
                    key={video.id}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-105 transition-transform"
                  >
                    <div className="w-full aspect-video rounded-lg overflow-hidden shadow">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-white text-center py-6 rounded-lg mt-8">
            <div className="flex justify-center space-x-10 sm:space-x-30">
              {/* Footer Icons */}
              <Link href="/">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-8"
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
                </div>
              </Link>

              <Link href="/Anime">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.362 5.214A8.252 8.252 0 0 1 12 21 
                    8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 
                    9 9.601a8.983 8.983 0 0 1 3.361-6.867 
                    8.21 8.21 0 0 0 3 2.48Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 18a3.75 3.75 0 0 0 .495-7.468 
                    5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 
                    1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"
                    />
                  </svg>
                </div>
              </Link>

              <Link href="/Tv-Show">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="size-8"
                  >
                    <path
                      d="M15.182 15.182a4.5 4.5 0 0 1-6.364 
                    0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 
                    9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 
                    9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 
                    0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 
                    0h.008v.015h-.008V9.75Z"
                    />
                  </svg>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
