import { FaSearch } from "react-icons/fa";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Link as ScrollLink } from "react-scroll";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    } else {
      setSearchTerm("");
    }
  }, [location.search]);

  const isHomePage = location.pathname === "/";

  return (
    <header className="bg-gradient-to-r from-slate-700 to-slate-800 shadow-lg fixed top-0 left-0 w-full z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto p-3 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <RouterLink to="/">
          <h1 className="font-bold text-xl sm:text-2xl flex items-center">
            <span className="text-white font-serif italic font-semibold tracking-tight">
              Smart<span className="text-blue-400">Estate</span>
            </span>
          </h1>
        </RouterLink>

        {/* Animated Search Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 rounded-full flex items-center transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-400 focus-within:shadow-md overflow-hidden" // Added rounded-full, focus-within styles, and overflow-hidden
        >
          <input
            type="text"
            placeholder="Search properties..."
            className="bg-transparent focus:outline-none w-28 sm:w-56 md:w-72 px-4 py-2 text-sm text-slate-700 placeholder-slate-500 rounded-full pr-2 transition-all duration-300" // Adjusted width, padding, and rounded-full
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button aria-label="Search" type="submit" className="p-2">
            {" "}
            {/* Added padding to the button */}
            <FaSearch className="text-slate-600 hover:text-blue-500 transition-colors text-lg" />{" "}
            {/* Increased icon size */}
          </button>
        </form>

        {/* Navigation Links */}
        <nav>
          <ul className="flex items-center gap-4 sm:gap-6">
            {isHomePage ? (
              <>
                <li>
                  <ScrollLink
                    to="home-hero"
                    smooth={true}
                    duration={500}
                    spy={true}
                    offset={-70}
                    className="hidden sm:inline text-white hover:text-blue-300 transition-colors cursor-pointer font-medium"
                    activeClass="text-blue-300 border-b-2 border-blue-300"
                  >
                    Home
                  </ScrollLink>
                </li>
                <li>
                  <ScrollLink
                    to="about-section"
                    smooth={true}
                    duration={500}
                    spy={true}
                    offset={-70}
                    className="hidden sm:inline text-white hover:text-blue-300 transition-colors cursor-pointer font-medium"
                    activeClass="text-blue-300 border-b-2 border-blue-300"
                  >
                    About
                  </ScrollLink>
                </li>
              </>
            ) : (
              <>
                <li>
                  <RouterLink
                    to="/#home-hero"
                    className="hidden sm:inline text-white hover:text-blue-300 transition-colors font-medium"
                  >
                    Home
                  </RouterLink>
                </li>
                <li>
                  <RouterLink
                    to="/#about-section"
                    className="hidden sm:inline text-white hover:text-blue-300 transition-colors font-medium"
                  >
                    About
                  </RouterLink>
                </li>
              </>
            )}

            <li>
              <RouterLink to="/profile">
                {currentUser ? (
                  <img
                    className="rounded-full h-8 w-8 object-cover flex-shrink-0 border-2 border-blue-400 hover:opacity-90 transition-opacity"
                    src={currentUser.avatar}
                    alt="profile"
                    onError={(e) => {
                      e.target.src =
                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
                      e.target.onerror = null;
                    }}
                  />
                ) : (
                  <span className="text-white hover:text-blue-300 transition-colors font-medium">
                    Sign In
                  </span>
                )}
              </RouterLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
