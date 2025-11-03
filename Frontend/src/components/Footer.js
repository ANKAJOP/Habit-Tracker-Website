import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-r from-teal-700 via-cyan-600 to-blue-700 text-white py-16 shadow-inner">
      {/* Decorative Glow Circles */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-cyan-400 opacity-20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-teal-400 opacity-20 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          {/* Brand / Description */}
          <div>
            <h3 className="text-3xl font-extrabold mb-4 text-white tracking-wide">
              HabitTracker<span className="text-yellow-300">.</span>
            </h3>
            <p className="text-gray-200 leading-relaxed">
              Build lasting habits, stay consistent, and achieve your personal growth goals — one day at a time.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-xl font-semibold mb-5 text-yellow-300">Explore</h4>
            <ul className="space-y-3 text-lg">
              {[
                { to: "/dashboard", label: "Dashboard" },
                { to: "/about", label: "About" },
                { to: "/habits", label: "Habits" },
                { to: "/progress", label: "Progress" },
                { to: "/contact", label: "Contact Us" },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.to}
                    className="text-gray-200 hover:text-white hover:translate-x-1 inline-block transform transition-all duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials & Contact */}
          <div>
            <h4 className="text-xl font-semibold mb-5 text-yellow-300">Connect</h4>
            <div className="flex justify-center md:justify-start space-x-6 mb-5">
              {[
                {
                  href: "https://twitter.com",
                  icon: (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985a9.935 9.935 0 00-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  ),
                },
                {
                  href: "https://facebook.com",
                  icon: (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  ),
                },
                {
                  href: "https://instagram.com",
                  icon: (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7.75 2C4.574 2 2 4.574 2 7.75v8.5C2 19.426 4.574 22 7.75 22h8.5c3.176 0 5.75-2.574 5.75-5.75v-8.5C22 4.574 19.426 2 16.25 2h-8.5zM12 7.25a4.75 4.75 0 110 9.5 4.75 4.75 0 010-9.5zm6-1.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5zm-6 3a3.25 3.25 0 100 6.5 3.25 3.25 0 000-6.5z" />
                     </svg>
  ),
},
,
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <p className="text-gray-200 text-lg">
              📧{" "}
              <a
                href="mailto:support@habittracker.com"
                className="hover:text-yellow-300 transition duration-300"
              >
                support@habittracker.com
              </a>
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 pt-8 border-t border-cyan-400/50 text-center">
          <p className="text-gray-200 text-sm tracking-wide">
            &copy; {new Date().getFullYear()} <span className="font-semibold">HabitTracker</span>.  
            All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
