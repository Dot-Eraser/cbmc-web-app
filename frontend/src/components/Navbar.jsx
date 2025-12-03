import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBars, FaTimes, FaUserShield } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Safe auth check - handles if useAuth is undefined
  let user = null;
  try {
    const auth = useAuth();
    user = auth?.user || null;
  } catch (error) {
    console.log('Auth not available');
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };
   const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-maroon to-maroon-deep shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3" onClick={closeMenu}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-light via-saffron-light to-saffron flex items-center justify-center shadow-lg">
              <span className="text-2xl">☸</span>
            </div>
            <div className="flex flex-col">
              <span className="font-playfair text-xl text-gold-light">
                CBMC
              </span>
              <span className="text-xs text-gold-light/80 uppercase tracking-wider">
                Meditation Center
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("home")}
              className="text-gold-light/90 hover:text-saffron-light transition"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("events")}
              className="text-gold-light/90 hover:text-saffron-light transition"
            >
              Events
            </button>
            <button
              onClick={() => scrollToSection("gallery")}
              className="text-gold-light/90 hover:text-saffron-light transition"
            >
              Gallery
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="text-gold-light/90 hover:text-saffron-light transition"
            >
              Testimonials
            </button>
            <button
              onClick={() => scrollToSection("membership")}
              className="text-gold-light/90 hover:text-saffron-light transition"
            >
              Membership
            </button>
            
            {user && (
              <Link
                to="/admin"
                className="flex items-center gap-2 px-4 py-2 bg-maroon text-white rounded-lg hover:bg-maroon hover:opacity-90 transition font-medium shadow-md"
              >
                <FaUserShield />
                <span>Admin</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {user && (
              <Link to="/admin" onClick={closeMenu} className="p-2 text-maroon hover:bg-gray-100 rounded-lg transition">
                <FaUserShield size={20} />
              </Link>
            )}
            
            <button onClick={toggleMenu} className="text-gray-700 hover:text-maroon transition p-2">
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 mt-2">
            <div className="flex flex-col space-y-1 pt-2">
              <a href="#home" onClick={closeMenu} className="text-gray-700 hover:text-maroon hover:bg-gray-50 transition font-medium px-4 py-3 rounded-lg">
                Home
              </a>
              <a href="#events" onClick={closeMenu} className="text-gray-700 hover:text-maroon hover:bg-gray-50 transition font-medium px-4 py-3 rounded-lg">
                Events
              </a>
              <a href="#gallery" onClick={closeMenu} className="text-gray-700 hover:text-maroon hover:bg-gray-50 transition font-medium px-4 py-3 rounded-lg">
                Gallery
              </a>
              <a href="#testimonials" onClick={closeMenu} className="text-gray-700 hover:text-maroon hover:bg-gray-50 transition font-medium px-4 py-3 rounded-lg">
                Testimonials
              </a>
              <a href="#membership" onClick={closeMenu} className="text-gray-700 hover:text-maroon hover:bg-gray-50 transition font-medium px-4 py-3 rounded-lg">
                Membership
              </a>
              
              {user && (
                <Link to="/admin" onClick={closeMenu} className="flex items-center gap-2 px-4 py-3 bg-maroon text-white rounded-lg hover:bg-maroon hover:opacity-90 transition font-medium mx-2 mt-2">
                  <FaUserShield />
                  <span>Admin Panel</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;