import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import { useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaSearch } from "react-icons/fa";
import {toast} from 'react-toastify'

const Navbar = () => {
  const { token, setToken, searchQuery, setSearchQuery } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogButton = () => {
    if (token) {
      setToken(null);
      localStorage.removeItem("token");
    }
    toast.success("Logged Out");
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate("/news");
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchQuery.trim()) {
        navigate("/news");
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const navItems = [
    { label: "HOME", path: "/" },
    { label: "ABOUT", path: "/about" },
    { label: "SAVED NEWS", path: "/saved" },
    { label: "ALL NEWS", path: "/news" },
  ];

  return (
    <div className="fixed top-0 w-full z-50 bg-[#111]/60 backdrop-blur-md border-b border-white/10 shadow-[0_5px_20px_-5px_rgba(255,255,255,0.1)]">
      <div className="py-4 px-4 sm:px-6 md:px-8 flex justify-between items-center gap-4 flex-wrap">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img
            className="w-9 h-9"
            src="https://img.icons8.com/fluency/48/news.png"
            alt="news"
          />
          <h2 className="text-white text-3xl sm:text-2xl font-bold tracking-wide">
            News<span className="text-red-500">Nectar</span>
          </h2>
        </div>

        {/* Mobile Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex md:hidden items-center bg-white/10 border border-white/20 rounded-md overflow-hidden w-72"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search news..."
            className="bg-transparent text-white px-3 py-2 w-full outline-none placeholder:text-white/60 text-sm"
          />
          <button type="submit" className="px-3 text-red-500">
            <FaSearch />
          </button>
        </form>

        {/* Hamburger Toggle */}
        <div
          className="md:hidden text-white text-2xl cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Desktop Search Bar */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center bg-white/10 border border-white/20 rounded-md overflow-hidden w-[40%] lg:w-[30%]"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search news..."
            className="bg-transparent text-white px-3 py-2 w-full outline-none placeholder:text-white/60"
          />
          <button
            type="submit"
            className="px-4 text-red-500 hover:text-red-400"
          >
            <FaSearch />
          </button>
        </form>

        {/* Desktop Nav + Login */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex gap-6 text-white text-lg font-medium">
            {navItems.map((item) => (
              <li
                key={item.label}
                className="relative group cursor-pointer transition-all duration-300"
                onClick={() => navigate(item.path)}
              >
                {item.label}
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] bg-red-500 transition-all duration-300 
                    ${
                      location.pathname === item.path
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                ></span>
              </li>
            ))}
          </ul>

          <button
            onClick={handleLogButton}
            className="text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:to-red-800 focus:ring-1 focus:outline-none focus:ring-red-600 shadow-lg shadow-red-500/30 font-semibold rounded-lg text-sm px-5 py-2 transition-all"
          >
            {token ? "LOG OUT" : "LOG IN"}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#111]/90 backdrop-blur-md border-t border-white/10 px-4 pb-4 pt-2 space-y-4 text-white text-base font-medium animate-slideDown">
          {navItems.map((item) => (
            <div
              key={item.label}
              onClick={() => {
                navigate(item.path);
                setMenuOpen(false);
              }}
              className={`cursor-pointer py-1 transition-all ${
                location.pathname === item.path ? "text-red-500" : ""
              }`}
            >
              {item.label}
            </div>
          ))}

          <button
            onClick={() => {
              handleLogButton();
              setMenuOpen(false);
            }}
            className="text-white w-full bg-red-600 px-4 py-2 rounded-md"
          >
            {token ? "LOG OUT" : "LOG IN"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
