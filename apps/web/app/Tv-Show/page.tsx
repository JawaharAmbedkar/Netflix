import Link from "next/link";
import { Navbar } from "../components/navbar";
import { anime } from "../videos/Anime/anime";
import { movies } from "../videos/Movies/movies";
import { videos } from "../videos/TopSearches/video";
import { tvshows } from "../videos/Tv Shows/tvshow";
import Footer from "../components/footer";
import TopSearches from "../components/TopSearches";

export default function TvShow() {
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
                {/* Background Image / Link */}
                <Link href="https://www.youtube.com/watch?v=YQeUmSD1c3g&ab_channel=DexteronParamount%2BwithShowtime">
                  <img
                    src="/thumbnails/Dexter.main.jpg"
                    alt="Dexter"
                    className="w-full h-full object-cover"
                  />
                </Link>

                {/* First PNG Logo Overlay */}
                <div className="absolute bottom-34 right-16 sm:bottom-70 sm:right-26 md:bottom-85 md:right-23 z-20 p-2 w-[150px] sm:w-[160px] md:w-[170px]">
                  <img
                    src="/png/series/N-series.png"
                    alt="Series Logo"
                    className="w-full filter brightness-150"
                  />
                </div>

                {/* Second PNG Logo Overlay */}
                <div className="absolute bottom-1 right-10 sm:bottom-37 sm:right-22 md:bottom-50 md:right-18 z-20 p-2 w-[200px] sm:w-[200px] md:w-[210px]">
                  <img
                    src="/png/series/Dexter.png"
                    alt="Dexter Logo"
                    className="w-full filter brightness-150"
                  />
                </div>

                {/* Paragraph Overlay */}
                <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 md:bottom-6 md:right-6 z-20 p-4 rounded-md max-w-[500px] sm:max-w-[450px] md:max-w-[400px] backdrop-blur-md hidden sm:block">
                  <p className="text-white text-sm sm:text-base md:text-lg font-light leading-relaxed">
                    Dexter Morgan, a man with homicidal tendencies, lives a double life.
                    He works as a forensic technician for the police department during the day
                    and kills heinous perpetrators in his free time.
                  </p>
                </div>
              </div>

              {/* TV Shows Section */}
              <div className="mt-10">
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

              {/* Movies Section */}
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

              {/* Anime Section */}
              <div className="mt-10">
                <Link href="/Anime">
                  <div className="flex font-bold text-2xl my-2">ANIME</div>
                </Link>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {anime.map((animeItem) => (
                    <a
                      key={animeItem.id}
                      href={animeItem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:scale-105 transition-transform"
                    >
                      <div className="w-full aspect-video rounded-lg overflow-hidden shadow">
                        <img
                          src={animeItem.thumbnail}
                          alt={animeItem.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side: Top Searches */}
            <TopSearches videos={videos} />
          </div>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
}
