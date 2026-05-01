import React from "react";

const LoadingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-10">
      <div className="max-w-lg w-full rounded-3xl  border border-slate-800 shadow-[0_25px_80px_-30px_rgba(15,23,42,0.8)] p-8 backdrop-blur-xl text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-sky-500/15 to-violet-500/15 text-sky-300 shadow-[0_16px_40px_-24px_rgba(59,130,246,0.7)]">
          <div className="h-16 w-16 rounded-full border-4 border-slate-700 border-t-sky-400 animate-spin" />
        </div>

        <h1 className="text-3xl font-semibold mb-3">
          Preparing your dashboard
        </h1>
        <p className="text-sm text-slate-400 mb-6">
          Hang tight — fetching your feed, connections, and latest updates now.
        </p>

        <div className="space-y-3">
          <div className="h-3 rounded-full bg-slate-800 animate-pulse" />
          <div className="h-3 rounded-full bg-slate-800 animate-pulse delay-75" />
          <div className="h-3 rounded-full bg-slate-800 animate-pulse delay-150" />
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
