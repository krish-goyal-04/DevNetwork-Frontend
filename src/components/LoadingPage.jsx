import React from "react";

// LoadingPage gives users a polished dark loading experience while async content loads.
// It uses subtle motion and colored progress bars to communicate activity without overwhelming the interface.
const LoadingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-8 text-center">
        {/* Logo and Spinner */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-sky-500 rounded-lg flex items-center justify-center">
              <span className="text-slate-950 font-bold text-xl">D</span>
            </div>
            <span className="text-2xl font-bold text-white">DevNetwork</span>
          </div>

          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-800 border-t-sky-500 rounded-full animate-spin mx-auto"></div>
            <div
              className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-sky-400 rounded-full animate-spin mx-auto"
              style={{
                animationDirection: "reverse",
                animationDuration: "1.5s",
              }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-2xl font-bold text-white mb-3">
          Preparing your dashboard
        </h1>
        <p className="text-slate-400 mb-8">
          Hang tight — fetching your feed, connections, and latest updates now.
        </p>

        {/* Loading bars */}
        <div className="space-y-3">
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-500 rounded-full animate-pulse"
              style={{
                width: "100%",
                animation: "loading 2s ease-in-out infinite",
              }}
            ></div>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-500 rounded-full animate-pulse"
              style={{
                width: "80%",
                animation: "loading 2s ease-in-out infinite",
                animationDelay: "0.2s",
              }}
            ></div>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-500 rounded-full animate-pulse"
              style={{
                width: "60%",
                animation: "loading 2s ease-in-out infinite",
                animationDelay: "0.4s",
              }}
            ></div>
          </div>
        </div>

        {/* Fun message */}
        <p className="text-sm text-slate-400 mt-6">
          Building connections, one developer at a time...
        </p>
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default LoadingPage;
