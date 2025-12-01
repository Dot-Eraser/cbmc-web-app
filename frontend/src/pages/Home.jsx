import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { eventsAPI, galleryAPI, testimonialsAPI, membershipsAPI, announcementsAPI } from '../services/api';
import { FaCalendar, FaClock, FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import { format } from 'date-fns';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    membershipType: 'individual',
    consent: false
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [eventsRes, galleriesRes, testimonialsRes, announcementRes] = await Promise.all([
        eventsAPI.getAll(),
        galleryAPI.getAll(),
        testimonialsAPI.getAll(),
        announcementsAPI.getCurrent()
      ]);

      setEvents(eventsRes.data.data || []);
      setGalleries(galleriesRes.data.data || []);
      setTestimonials(testimonialsRes.data.data?.filter(t => t.isApproved) || []);
      setAnnouncement(announcementRes.data.data || null);

      if (galleriesRes.data.data && galleriesRes.data.data.length > 0) {
        setSelectedCategory(galleriesRes.data.data[0]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.consent) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    try {
      await membershipsAPI.create(formData);
      toast.success('Membership application submitted successfully!');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        city: '',
        membershipType: 'individual',
        consent: false
      });
    } catch (error) {
      toast.error('Failed to submit application');
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'} />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-saffron border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      {announcement && announcement.isActive && (
        <div className="bg-gradient-to-r from-saffron to-orange-600 text-white py-3 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 flex-wrap">
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold">
              {announcement.badge}
            </span>
            <p className="text-center">{announcement.text}</p>
            {announcement.cta && (
              <a href={announcement.ctaLink} className="px-4 py-2 bg-white text-saffron rounded-full font-semibold">
                {announcement.cta}
              </a>
            )}
          </div>
        </div>
      )}

      <section id="home" className="py-20 text-center bg-gradient-to-br from-cream via-white to-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-playfair text-5xl md:text-6xl text-maroon mb-6">
            Find Peace Within
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our community in the practice of mindfulness, meditation, and Buddhist teachings
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#membership" className="px-8 py-3 rounded-full bg-gradient-to-r from-saffron to-orange-600 text-white font-semibold hover:shadow-lg transition">
              Become a Member
            </a>
            <a href="#events" className="px-8 py-3 rounded-full border-2 border-maroon text-maroon font-semibold hover:bg-maroon hover:text-white transition">
              View Events
            </a>
          </div>
        </div>
      </section>

      <section id="events" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-4xl text-maroon mb-4">Upcoming Events</h2>
            <p className="text-gray-600">Join us in our spiritual journey</p>
          </div>

          {events.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No upcoming events</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <div key={event._id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
                  <div className="relative h-48 overflow-hidden">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-saffron text-white rounded-full text-sm font-semibold capitalize">
                        {event.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-playfair text-xl text-maroon mb-3">{event.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{event.description}</p>
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <FaCalendar className="text-saffron" />
                        <span>{format(new Date(event.date), 'MMMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaClock className="text-saffron" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-saffron" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="gallery" className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-4xl text-maroon mb-4">Photo Gallery</h2>
            <p className="text-gray-600">Moments from our community</p>
          </div>

          {galleries.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No gallery items yet</p>
          ) : (
            <div>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {galleries.map((gallery) => (
                  <button
                    key={gallery._id}
                    onClick={() => setSelectedCategory(gallery)}
                    className={`px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition ${
                      selectedCategory?._id === gallery._id ? 'bg-maroon text-white' : 'bg-white text-maroon hover:bg-cream-dark'
                    }`}
                  >
                    <span className="text-xl">{gallery.icon}</span>
                    <span>{gallery.category}</span>
                  </button>
                ))}
              </div>

              {selectedCategory && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedCategory.images.map((image, index) => (
                    <div key={index} className="relative group overflow-hidden rounded-xl shadow-lg">
                      <img src={image.url} alt={image.caption} className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-sm">{image.caption}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section id="testimonials" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-4xl text-maroon mb-4">What Our Members Say</h2>
            <p className="text-gray-600">Hear from our community</p>
          </div>

          {testimonials.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No testimonials yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div key={testimonial._id} className="bg-cream rounded-xl p-6 shadow-lg hover:shadow-2xl transition-shadow">
                  <div className="flex gap-1 mb-4">
                    {renderStars(testimonial.rating)}
                  </div>
                  <p className="text-gray-700 italic mb-4">&quot;{testimonial.text}&quot;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-saffron to-gold flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-maroon">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="membership" className="py-16 bg-gradient-to-br from-cream via-white to-cream">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-12">
      <h2 className="font-playfair text-4xl text-maroon mb-4">Become a Member</h2>
      <p className="text-gray-600">Join our growing spiritual community</p>
    </div>

    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl p-8">
      {/* Personal Information */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-maroon mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent"
              placeholder="(555) 123-4567"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent"
              placeholder="123 Main Street"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent"
              placeholder="Los Angeles"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State <span className="text-red-500">*</span>
            </label>
            <select
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent"
            >
              <option value="">Select State</option>
              <option value="CA">California</option>
              <option value="NY">New York</option>
              <option value="TX">Texas</option>
              <option value="FL">Florida</option>
              <option value="IL">Illinois</option>
              <option value="PA">Pennsylvania</option>
              <option value="OH">Ohio</option>
              <option value="GA">Georgia</option>
              <option value="NC">North Carolina</option>
              <option value="MI">Michigan</option>
              {/* Add more states as needed */}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ZIP Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              required
              pattern="[0-9]{5}"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent"
              placeholder="90210"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country <span className="text-red-500">*</span>
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent"
            >
              <option value="USA">United States</option>
              <option value="Canada">Canada</option>
              <option value="UK">United Kingdom</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Membership Type */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-maroon mb-4">Membership Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="relative flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-saffron transition">
            <input
              type="radio"
              name="membershipType"
              value="individual"
              checked={formData.membershipType === 'individual'}
              onChange={handleInputChange}
              className="w-5 h-5 text-saffron focus:ring-saffron"
            />
            <div className="ml-4">
              <div className="font-semibold text-gray-900">Individual</div>
              <div className="text-sm text-gray-600">$50/year</div>
            </div>
          </label>

          <label className="relative flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-saffron transition">
            <input
              type="radio"
              name="membershipType"
              value="family"
              checked={formData.membershipType === 'family'}
              onChange={handleInputChange}
              className="w-5 h-5 text-saffron focus:ring-saffron"
            />
            <div className="ml-4">
              <div className="font-semibold text-gray-900">Family</div>
              <div className="text-sm text-gray-600">$100/year (up to 4 members)</div>
            </div>
          </label>

          <label className="relative flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-saffron transition">
            <input
              type="radio"
              name="membershipType"
              value="student"
              checked={formData.membershipType === 'student'}
              onChange={handleInputChange}
              className="w-5 h-5 text-saffron focus:ring-saffron"
            />
            <div className="ml-4">
              <div className="font-semibold text-gray-900">Student</div>
              <div className="text-sm text-gray-600">$25/year (valid student ID required)</div>
            </div>
          </label>

          <label className="relative flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-saffron transition">
            <input
              type="radio"
              name="membershipType"
              value="senior"
              checked={formData.membershipType === 'senior'}
              onChange={handleInputChange}
              className="w-5 h-5 text-saffron focus:ring-saffron"
            />
            <div className="ml-4">
              <div className="font-semibold text-gray-900">Senior</div>
              <div className="text-sm text-gray-600">$35/year (65+ years)</div>
            </div>
          </label>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-maroon mb-4">Emergency Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent"
              placeholder="Jane Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="emergencyContactPhone"
              value={formData.emergencyContactPhone}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent"
              placeholder="(555) 987-6543"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Relationship <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="emergencyContactRelationship"
              value={formData.emergencyContactRelationship}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent"
              placeholder="Spouse, Parent, Sibling, etc."
            />
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-maroon mb-4">Additional Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How did you hear about us?
            </label>
            <select
              name="hearAboutUs"
              value={formData.hearAboutUs}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent"
            >
              <option value="">Select an option</option>
              <option value="friend">Friend/Family Referral</option>
              <option value="social-media">Social Media</option>
              <option value="website">Website/Google Search</option>
              <option value="event">Event/Program</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Areas of Interest (select all that apply)
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" name="interest_meditation" onChange={handleInputChange} className="w-5 h-5 text-saffron focus:ring-saffron rounded" />
                <span className="ml-3 text-gray-700">Meditation Classes</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" name="interest_dharma" onChange={handleInputChange} className="w-5 h-5 text-saffron focus:ring-saffron rounded" />
                <span className="ml-3 text-gray-700">Dharma Talks</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" name="interest_retreats" onChange={handleInputChange} className="w-5 h-5 text-saffron focus:ring-saffron rounded" />
                <span className="ml-3 text-gray-700">Retreats</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" name="interest_volunteering" onChange={handleInputChange} className="w-5 h-5 text-saffron focus:ring-saffron rounded" />
                <span className="ml-3 text-gray-700">Volunteering Opportunities</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" name="interest_youth" onChange={handleInputChange} className="w-5 h-5 text-saffron focus:ring-saffron rounded" />
                <span className="ml-3 text-gray-700">Youth Programs</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comments or Special Requests
            </label>
            <textarea
              name="comments"
              value={formData.comments}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent"
              placeholder="Any additional information you'd like to share..."
            ></textarea>
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="mb-6">
        <div className="bg-gray-50 p-6 rounded-lg mb-4">
          <h4 className="font-semibold text-gray-900 mb-2">Membership Agreement</h4>
          <div className="text-sm text-gray-600 space-y-2">
            <p>By becoming a member, you agree to:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Respect the center's guidelines and code of conduct</li>
              <li>Support the center's mission and values</li>
              <li>Participate actively in community activities</li>
              <li>Pay annual membership dues on time</li>
            </ul>
          </div>
        </div>

        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            name="consent"
            checked={formData.consent}
            onChange={handleInputChange}
            required
            className="mt-1 w-5 h-5 text-saffron focus:ring-saffron border-gray-300 rounded"
          />
          <span className="text-sm text-gray-700">
            I agree to the terms and conditions and wish to become a member of California Buddhist Meditation Center <span className="text-red-500">*</span>
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-4 bg-gradient-to-r from-saffron to-orange-600 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow text-lg"
      >
        Submit Membership Application
      </button>

      <p className="text-center text-sm text-gray-500 mt-4">
        <span className="text-red-500">*</span> Required fields
      </p>
    </form>
  </div>
</section>
    </div>
  );
};

export default Home;