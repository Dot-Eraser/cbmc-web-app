import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-maroon-deep to-black text-gold-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-gold font-playfair text-xl mb-4">About CBMC</h3>
            <p className="text-gold-light/80 leading-relaxed">
              California Buddhist Meditation Center is dedicated to sharing the Buddha's teachings
              and providing a peaceful space for meditation and spiritual growth.
            </p>
          </div>

          <div>
            <h3 className="text-gold font-playfair text-xl mb-4">Contact</h3>
            <p className="text-gold-light/80">
              Email: info@cbmc.org<br />
              Phone: (555) 123-4567<br />
              Address: 123 Peace Ave, CA 90210
            </p>
          </div>

          <div>
            <h3 className="text-gold font-playfair text-xl mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gold-light/80 hover:text-saffron-light transition text-2xl">
                <FaFacebook />
              </a>
              <a href="#" className="text-gold-light/80 hover:text-saffron-light transition text-2xl">
                <FaTwitter />
              </a>
              <a href="#" className="text-gold-light/80 hover:text-saffron-light transition text-2xl">
                <FaInstagram />
              </a>
              <a href="#" className="text-gold-light/80 hover:text-saffron-light transition text-2xl">
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gold-light/20 mt-8 pt-6 text-center text-gold-light/60">
          <p>&copy; 2024 California Buddhist Meditation Center. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;