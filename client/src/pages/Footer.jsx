import React from "react";
import { Link } from "react-router-dom"; // Use Router Link if needed for Privacy Policy etc.
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa"; // Example social icons

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-800 text-slate-300 py-8 px-4 sm:px-6 lg:px-8 mt-2">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Column 1: Brand and Description */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-3 font-serif italic">
            Smart<span className="text-blue-400">Estate</span>
          </h3>
          <p className="text-sm text-slate-400">
            Connecting you with your perfect property. Explore listings, find
            agents, and start your real estate journey today.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="text-lg font-medium text-white mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/search"
                className="hover:text-blue-300 transition-colors"
              >
                Search Properties
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-blue-300 transition-colors"
              >
                {" "}
                {/* Or use ScrollLink if About stays on home */}
                About Us
              </Link>
            </li>
            {/* Add other links like Contact, FAQ, Terms, Privacy */}
            <li>
              <Link
                to="/privacy-policy"
                className="hover:text-blue-300 transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to="/terms-of-service"
                className="hover:text-blue-300 transition-colors"
              >
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Social Media */}
        <div>
          <h4 className="text-lg font-medium text-white mb-3">
            Connect With Us
          </h4>
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-slate-400 hover:text-blue-400 transition-colors"
            >
              <FaFacebook size={20} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="text-slate-400 hover:text-blue-400 transition-colors"
            >
              <FaTwitter size={20} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-slate-400 hover:text-pink-400 transition-colors"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-slate-400 hover:text-blue-500 transition-colors"
            >
              <FaLinkedin size={20} />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-slate-700 text-center text-sm text-slate-500">
        &copy; {currentYear} SmartEstate. All rights reserved.
      </div>
    </footer>
  );
}
