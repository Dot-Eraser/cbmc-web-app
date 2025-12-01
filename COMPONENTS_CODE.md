# COMPLETE REACT COMPONENTS CODE

This file contains all the React components you need to create.
Copy each section into its respective file.

---

## src/components/Footer.jsx

```jsx
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-maroon-deep to-black text-gold-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-gold font-playfair text-xl mb-4">About CBMC</h3>
            <p className="text-gold-light/80 leading-relaxed">
              California Buddhist Meditation Center is dedicated to sharing the Buddha's teachings
              and providing a peaceful space for meditation and spiritual growth.
            </p>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-gold font-playfair text-xl mb-4">Contact</h3>
            <p className="text-gold-light/80">
              Email: info@cbmc.org<br />
              Phone: (555) 123-4567<br />
              Address: 123 Peace Ave, CA 90210
            </p>
          </div>

          {/* Quick Links */}
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
```

---

## src/pages/Home.jsx

```jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  eventsAPI,
  galleryAPI,
  testimonialsAPI,
  membershipsAPI,
  announcementsAPI,
} from '../services/api';
import { FaCalendar, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { format } from 'date-fns';

const Home = () => {
  const [announcement, setAnnouncement] = useState(null);
  const [events, setEvents] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [announcementRes, eventsRes, galleriesRes, testimonialsRes] = await Promise.all([
        announcementsAPI.getCurrent(),
        eventsAPI.getAll(),
        galleryAPI.getAll(),
        testimonialsAPI.getAll(),
      ]);

      setAnnouncement(announcementRes.data.data);
      setEvents(eventsRes.data.data);
      setGalleries(galleriesRes.data.data);
      setTestimonials(testimonialsRes.data.data);
      
      if (galleriesRes.data.data.length > 0) {
        setSelectedGallery(galleriesRes.data.data[0]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
      setLoading(false);
    }
  };

  const handleMembershipSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const data = {
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      city: formData.get('city'),
      membershipType: formData.get('membershipType'),
      consent: formData.get('consent') === 'on',
    };

    try {
      await membershipsAPI.create(data);
      toast.success('Membership application submitted successfully!');
      e.target.reset();
    } catch (error) {
      toast.error('Failed to submit application');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-saffron border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Announcement Bar */}
      {announcement && (
        <div className="bg-gradient-to-r from-maroon to-maroon-deep text-gold-light py-3 px-4 text-center">
          {announcement.badge && (
            <span className="inline-block bg-gold-light/15 border border-gold-light/60 rounded-full px-3 py-1 text-xs mr-3 uppercase tracking-wider">
              {announcement.badge}
            </span>
          )}
          <span>{announcement.text}</span>
          {announcement.cta && (
            <button className="ml-4 px-4 py-1 rounded-full border border-gold-light/80 bg-gold-light/8 text-sm hover:bg-gold-light/20 transition">
              {announcement.cta}
            </button>
          )}
        </div>
      )}

      {/* Hero Section */}
      <section id="home" className="py-20 text-center bg-gradient-to-br from-cream via-white to-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-playfair text-5xl md:text-6xl text-maroon mb-6"
          >
            Find Peace Within
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            Join our community in the practice of mindfulness, meditation, and Buddhist teachings
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <a
              href="#membership"
              className="px-8 py-3 rounded-full bg-gradient-to-r from-saffron to-orange-600 text-white font-semibold hover:shadow-lg transition"
            >
              Become a Member
            </a>
            <a
              href="#events"
              className="px-8 py-3 rounded-full border-2 border-maroon text-maroon font-semibold hover:bg-maroon hover:text-white transition"
            >
              View Events
            </a>
          </motion.div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-4xl text-maroon mb-2">Upcoming Events</h2>
            <p className="text-gray-600">Join us for our spiritual programs and community gatherings</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                {event.image ? (
                  <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-cream to-gold-light"></div>
                )}
                <div className="p-6">
                  <span className="inline-block bg-saffron-light text-white px-3 py-1 rounded-full text-sm mb-3">
                    {format(new Date(event.date), 'MMM dd, yyyy')}
                  </span>
                  <h3 className="font-playfair text-xl text-maroon mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="flex items-center text-gold text-sm">
                    <FaClock className="mr-2" />
                    {event.time}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-4xl text-maroon mb-2">Photo Gallery</h2>
            <p className="text-gray-600">Moments from our community events and celebrations</p>
          </div>

          {/* Gallery Categories */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {galleries.map((gallery) => (
              <button
                key={gallery._id}
                onClick={() => setSelectedGallery(gallery)}
                className={`p-6 rounded-xl text-center transition ${
                  selectedGallery?._id === gallery._id
                    ? 'bg-white border-2 border-saffron shadow-lg'
                    : 'bg-white hover:shadow-md'
                }`}
              >
                <div className="text-4xl mb-2">{gallery.icon}</div>
                <div className="font-semibold text-maroon">{gallery.category}</div>
              </button>
            ))}
          </div>

          {/* Gallery Photos */}
          {selectedGallery && (
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="font-playfair text-2xl text-maroon mb-4">{selectedGallery.category}</h3>
              <p className="text-gray-600 mb-6">{selectedGallery.images.length} photos</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedGallery.images.map((image, index) => (
                  <div key={index} className="rounded-lg overflow-hidden aspect-video">
                    <img
                      src={image.url}
                      alt={image.caption || selectedGallery.category}
                      className="w-full h-full object-cover hover:scale-110 transition duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-4xl text-maroon mb-2">What Our Members Say</h2>
            <p className="text-gray-600">Hear from our community about their journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-8 shadow-lg relative"
              >
                <div className="text-6xl text-gold-light/50 absolute top-4 left-6">"</div>
                <p className="text-gray-600 italic pt-12 mb-6">{testimonial.text}</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-saffron-light to-gold flex items-center justify-center text-white font-semibold text-lg">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-maroon">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Form Section */}
      <section id="membership" className="py-16 bg-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-4xl text-maroon mb-2">Become a Member</h2>
            <p className="text-gray-600">Join our spiritual community and receive exclusive benefits</p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg">
            <form onSubmit={handleMembershipSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-maroon font-semibold mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    className="w-full px-4 py-2 border-2 border-cream-dark rounded-lg focus:border-saffron focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-maroon font-semibold mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-2 border-2 border-cream-dark rounded-lg focus:border-saffron focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-maroon font-semibold mb-2">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="w-full px-4 py-2 border-2 border-cream-dark rounded-lg focus:border-saffron focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-maroon font-semibold mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    className="w-full px-4 py-2 border-2 border-cream-dark rounded-lg focus:border-saffron focus:outline-none"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-maroon font-semibold mb-2">Membership Type *</label>
                <select
                  name="membershipType"
                  required
                  className="w-full px-4 py-2 border-2 border-cream-dark rounded-lg focus:border-saffron focus:outline-none"
                >
                  <option value="">Select type</option>
                  <option value="individual">Individual</option>
                  <option value="family">Family</option>
                  <option value="student">Student</option>
                  <option value="senior">Senior</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="flex items-center">
                  <input type="checkbox" name="consent" required className="mr-2" />
                  <span className="text-gray-600">I agree to receive communications from CBMC</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full px-8 py-3 rounded-full bg-gradient-to-r from-saffron to-orange-600 text-white font-semibold hover:shadow-lg transition"
              >
                Submit Application
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
```

---

## src/pages/AdminPanel.jsx

```jsx
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  eventsAPI,
  galleryAPI,
  testimonialsAPI,
  announcementsAPI,
  membershipsAPI,
} from '../services/api';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      if (activeTab === 'events') {
        const res = await eventsAPI.getAll();
        setEvents(res.data.data);
      } else if (activeTab === 'gallery') {
        const res = await galleryAPI.getAll();
        setGalleries(res.data.data);
      } else if (activeTab === 'testimonials') {
        const res = await testimonialsAPI.getAll();
        setTestimonials(res.data.data);
      } else if (activeTab === 'memberships') {
        const res = await membershipsAPI.getAll();
        setMemberships(res.data.data);
      }
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load data');
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventsAPI.delete(id);
        toast.success('Event deleted successfully');
        loadData();
      } catch (error) {
        toast.error('Failed to delete event');
      }
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      date: formData.get('date'),
      time: formData.get('time'),
      image: formData.get('image'),
      location: formData.get('location'),
    };

    try {
      await eventsAPI.create(data);
      toast.success('Event created successfully');
      e.target.reset();
      loadData();
    } catch (error) {
      toast.error('Failed to create event');
    }
  };

  // Similar handlers for other sections...

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-playfair text-4xl text-maroon mb-8 text-center">Admin Panel</h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {['events', 'gallery', 'testimonials', 'memberships', 'announcements'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full font-semibold capitalize transition ${
                activeTab === tab
                  ? 'bg-maroon text-white'
                  : 'bg-white text-maroon hover:bg-cream'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-maroon mb-6">Manage Events</h2>
            
            {/* Add Event Form */}
            <form onSubmit={handleEventSubmit} className="mb-8 border-b pb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  name="title"
                  placeholder="Event Title"
                  required
                  className="px-4 py-2 border rounded-lg"
                />
                <input
                  type="date"
                  name="date"
                  required
                  className="px-4 py-2 border rounded-lg"
                />
                <input
                  type="time"
                  name="time"
                  required
                  className="px-4 py-2 border rounded-lg"
                />
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  className="px-4 py-2 border rounded-lg"
                />
              </div>
              <textarea
                name="description"
                placeholder="Description"
                required
                rows="3"
                className="w-full px-4 py-2 border rounded-lg mb-4"
              />
              <input
                type="url"
                name="image"
                placeholder="Image URL"
                className="w-full px-4 py-2 border rounded-lg mb-4"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-saffron text-white rounded-lg hover:bg-saffron-light transition flex items-center gap-2"
              >
                <FaPlus /> Add Event
              </button>
            </form>

            {/* Events List */}
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event._id} className="flex justify-between items-center p-4 bg-cream rounded-lg">
                  <div>
                    <h3 className="font-bold text-maroon">{event.title}</h3>
                    <p className="text-sm text-gray-600">{event.date} at {event.time}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteEvent(event._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add similar sections for other tabs */}
      </div>
    </div>
  );
};

export default AdminPanel;
```

---

Save each section into its respective file path as shown in the comments.
