export default function WatchLoading() {
  return (
    <main
      className="flex min-h-screen items-center justify-center bg-canvas px-6 text-white"
      aria-live="polite"
      aria-label="Loading video"
    >
      <div className="flex flex-col items-center gap-5">
        <img
          className="h-40 w-40 object-contain sm:h-48 sm:w-48"
          src="/Loader/Popcorn.svg"
          alt=""
          aria-hidden="true"
        />
        <p className="text-sm font-medium text-warm-300">Loading your video…</p>
      </div>
    </main>
  );
}