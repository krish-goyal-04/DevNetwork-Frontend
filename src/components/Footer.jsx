import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-white/10 bg-[#0b1018]/80 text-slate-400">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400 text-sm font-bold text-slate-950">
            D
          </div>
          <div>
            <p className="font-semibold text-white">DevNetwork</p>
            <p className="text-sm">Connect, review, and chat with developers.</p>
          </div>
        </div>

        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <Link to="/feed" className="hover:text-cyan-300">
            Discover
          </Link>
          <Link to="/connections" className="hover:text-cyan-300">
            Network
          </Link>
          <Link to="/requests" className="hover:text-cyan-300">
            Requests
          </Link>
          <Link to="/profile" className="hover:text-cyan-300">
            Profile
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
