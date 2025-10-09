'use client';

import { useEffect, useRef, useState } from "react";
import { Navbar } from "../components/navbar";
import { anime } from "../videos/Anime/anime";
import { movies } from "../videos/Movies/movies";
import { tvshows } from "../videos/Tv Shows/tvshow";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Footer from "../components/footer";
import TopSearches from "../components/TopSearches";
import { videos } from "../videos/TopSearches/video";

export default function Homepage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showPoster, setShowPoster] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) router.push("/signin");
    else if (!session.user.membership) router.push("/membership-payment");
  }, [status, session, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPoster(false);
      videoRef.current?.play();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (status === "loading" || !session || !session.user.membership) {
    return <div className="text-white p-10 text-center">Checking access...</div>;
  }

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <img
        src="/background/backgroundImage.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md z-0" />

      <div className="relative z-10">
        <Navbar />

        <div id="mainVideo" className="min-h-screen p-4">
          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-5 lg:col-span-4">
              <div className="relative h-[62vh] rounded-lg overflow-hidden mb-6">
                {/* Video / Poster */}
                <Link href="https://www.youtube.com/watch?v=_InqQJRqGW4&ab_channel=Netflix">
                  <video
                    ref={videoRef}
                    src="/main-video/money_heist.mp4"
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                  />
                  {showPoster && (
                    <img
                      src="/Main-video/Money-Heist.jpg"
                      alt="Series Poster"
                      className="absolute top-0 left-0 w-full h-full object-cover z-10 transition-opacity duration-1000"
                    />
                  )}
                </Link>

                {/* Series Logo Overlay */}
                <div className="absolute bottom-4 right-0.2 sm:right-1 z-20 p-2 w-[300px] sm:bottom-43 sm:w-[350] md:w-[400px] md:bottom-62">
                  <img
                    src="/png/series/series.png"
                    alt="Money Heist Logo"
                    className="w-full filter brightness-150"
                  />
                </div>

                {/* Paragraph Overlay */}
                <div className="absolute bottom-4 right-4 z-20 p-4 rounded-md max-w-[500px] sm:max-w-[450px] md:max-w-[400px] backdrop-blur-md hidden sm:block sm:text-base md:text-base">
                  <p className="text-white text-sm sm:text-base md:text-lg font-light leading-relaxed">
                    Money Heist (La Casa de Papel) is a Spanish heist crime drama television series about a group of robbers who plan and execute heists on the Royal Mint of Spain and the Bank of Spain, led by the enigmatic Professor. It explores their complex relationships, moral dilemmas, and high-stakes strategies.
                  </p>
                </div>
              </div>
              {/* TV Shows */}
              <div className="mt-10">
                <Link href="/Tv-Show">
                  <div className="flex font-bold text-2xl my-2">TV SHOWS</div>
                </Link>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {tvshows.map(tv => (
                    <a key={tv.id} href={tv.url} target="_blank" rel="noopener noreferrer" className="hover:scale-105 transition-transform">
                      <div className="w-full aspect-video rounded-lg overflow-hidden shadow">
                        <img src={tv.thumbnail} alt={tv.title} className="w-full h-full object-cover" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Movies */}
              <div className="mt-10">
                <Link href="/Movies">
                  <div className="flex font-bold text-2xl my-2">MOVIES</div>
                </Link>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {movies.map(movie => (
                    <a key={movie.id} href={movie.url} target="_blank" rel="noopener noreferrer" className="hover:scale-105 transition-transform">
                      <div className="w-full aspect-video rounded-lg overflow-hidden shadow">
                        <img src={movie.thumbnail} alt={movie.title} className="w-full h-full object-cover" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Anime */}
              <div className="mt-10">
                <Link href="/Anime">
                  <div className="flex font-bold text-2xl my-2">ANIME</div>
                </Link>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {anime.map(animeItem => (
                    <a key={animeItem.id} href={animeItem.url} target="_blank" rel="noopener noreferrer" className="hover:scale-105 transition-transform">
                      <div className="w-full aspect-video rounded-lg overflow-hidden shadow">
                        <img src={animeItem.thumbnail} alt={animeItem.title} className="w-full h-full object-cover" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Searches */}
           <TopSearches videos={videos} />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
