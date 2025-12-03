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

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center" onClick={closeMenu}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-saffron to-gold rounded-full flex items-center justify-center">
                <span className="text-2xl">🙏</span>
              </div>
              <div>
                <h1 className="font-playfair text-2xl font-bold text-maroon">CBMC</h1>
                <p className="text-xs text-gray-600 hidden sm:block">California Buddhist Meditation Center</p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-maroon transition font-medium">
              Home
            </a>
            <a href="#events" className="text-gray-700 hover:text-maroon transition font-medium">
              Events
            </a>
            <a href="#gallery" className="text-gray-700 hover:text-maroon transition font-medium">
              Gallery
            </a>
            <a href="#testimonials" className="text-gray-700 hover:text-maroon transition font-medium">
              Testimonials
            </a>
            <a href="#membership" className="px-6 py-2 bg-gradient-to-r from-saffron to-orange-600 text-white rounded-full font-semibold hover:shadow-lg transition">
              Join Us
            </a>
            
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