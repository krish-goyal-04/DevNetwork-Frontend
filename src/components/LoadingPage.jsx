import React from "react";

const LoadingPage = () => {
  return (
    <div className="app-shell flex items-center justify-center px-4 py-10">
      <div className="panel w-full max-w-md p-8 text-center">
        <div className="mb-8">
          <div className="mb-6 flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-400">
              <span className="text-xl font-bold text-slate-950">D</span>
            </div>
            <span className="text-2xl font-bold text-white">DevNetwork</span>
          </div>

          <div className="relative">
            <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-slate-800 border-t-cyan-400" />
            <div
              className="absolute inset-0 mx-auto h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-cyan-300"
              style={{
                animationDirection: "reverse",
                animationDuration: "1.5s",
              }}
            />
          </div>
        </div>

        <h1 className="mb-3 text-2xl font-semibold text-white">
          Preparing your dashboard
        </h1>
        <p className="mb-8 text-slate-400">
          Hang tight - fetching your feed, connections, and latest updates now.
        </p>

        <div className="space-y-3">
          {[100, 80, 60].map((width, index) => (
            <div
              key={width}
              className="h-2 overflow-hidden rounded-full bg-slate-800"
            >
              <div
                className="h-full animate-pulse rounded-full bg-cyan-400"
                style={{
                  width: `${width}%`,
                  animation: "loading 2s ease-in-out infinite",
                  animationDelay: `${index * 0.2}s`,
                }}
              />
            </div>
          ))}
        </div>

        <style>{`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(0%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default LoadingPage;
