// Footer provides a consistent dark-end experience with supportive links and subtle contrast.
// The layout keeps key navigation and social actions accessible without distracting from the main content.
const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 mt-16 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
                <span className="text-slate-950 font-bold text-sm">D</span>
              </div>
              <span className="text-xl font-bold text-white">DevNetwork</span>
            </div>
            <p className="text-slate-400 mb-4 max-w-md">
              Connecting developers worldwide. Build your professional network,
              discover opportunities, and grow your career in tech.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-slate-400 hover:text-sky-400 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-sky-400 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-sky-400 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-sky-400 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 6.627 5.374 12 12 12s12-5.373 12-12c0-6.627-5.374-12-12-12zm5.562 8.161c-.18.717-.962 4.093-1.362 5.425-.168.568-.374.978-.586 1.174-.252.226-.587.252-.587.252s-.126.018-.252.018c-1.8 0-3.006-1.215-3.006-1.215s-.126-.09-.252-.09c-.126 0-.252.09-.252.09s-1.206 1.215-3.006 1.215c0 0-.335-.026-.587-.252-.212-.196-.418-.606-.586-1.174-.4-1.332-1.182-4.708-1.362-5.425-.09-.36-.198-.72-.198-.72s-.018-.09-.018-.252c0-.162.018-.252.054-.342.036-.09.126-.162.198-.198.126-.054.342-.036.522.018.198.072.522.306.81.666.288.36.612.774.864 1.026.288.288.522.504.522.504s.234-.216.522-.504c.252-.252.576-.666.864-1.026.288-.36.612-.594.81-.666.18-.054.396-.072.522-.018.072.036.162.108.198.198.036.09.054.18.054.342 0 .162-.018.36-.198.72z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Platform
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-slate-400 hover:text-sky-400 transition-colors"
                >
                  Find Developers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-400 hover:text-sky-400 transition-colors"
                >
                  My Network
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-400 hover:text-sky-400 transition-colors"
                >
                  Messages
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-400 hover:text-sky-400 transition-colors"
                >
                  Profile
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-slate-400 hover:text-sky-400 transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-400 hover:text-sky-400 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-400 hover:text-sky-400 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-400 hover:text-sky-400 transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} DevNetwork. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
