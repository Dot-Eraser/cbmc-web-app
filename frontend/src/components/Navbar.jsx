import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

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
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
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

          {/* Desktop Menu */}
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
            <Link
              to="/admin/login"
              className="px-4 py-2 rounded-full bg-gold-light/10 border border-gold-light/40 text-gold-light hover:bg-gold-light/20 transition"
            >
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gold-light text-2xl"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-maroon-deep/98 backdrop-blur-lg">
          <div className="px-4 pt-2 pb-4 space-y-3">
            <button
              onClick={() => scrollToSection("home")}
              className="block w-full text-left py-2 text-gold-light/90 hover:text-saffron-light transition"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("events")}
              className="block w-full text-left py-2 text-gold-light/90 hover:text-saffron-light transition"
            >
              Events
            </button>
            <button
              onClick={() => scrollToSection("gallery")}
              className="block w-full text-left py-2 text-gold-light/90 hover:text-saffron-light transition"
            >
              Gallery
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="block w-full text-left py-2 text-gold-light/90 hover:text-saffron-light transition"
            >
              Testimonials
            </button>
            <button
              onClick={() => scrollToSection("membership")}
              className="block w-full text-left py-2 text-gold-light/90 hover:text-saffron-light transition"
            >
              Membership
            </button>
            {/* Admin Button - Only show when logged in */}
            {user && (
              <Link
                to="/admin"
                className="flex items-center gap-2 px-4 py-2 bg-maroon text-white rounded-lg hover:bg-maroon/90 transition font-medium"
              >
                <FaUserShield />
                Admin
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
