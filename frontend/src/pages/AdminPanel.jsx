import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { membershipsAPI, eventsAPI, galleryAPI, testimonialsAPI } from '../services/api';
import { FaTrash, FaUserCircle, FaSignOutAlt, FaCalendar, FaImage, FaStar, FaEye, FaEdit, FaPlus, FaTimes } from 'react-icons/fa';
import { format, isValid, parseISO } from 'date-fns';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('memberships');
  const [memberships, setMemberships] = useState([]);
  const [events, setEvents] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Form states
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    image: '',
    status: 'upcoming'
  });
  
  const [galleryForm, setGalleryForm] = useState({
    category: '',
    icon: '📸',
    images: [{ url: '', caption: '' }]
  });
  
  const [testimonialForm, setTestimonialForm] = useState({
    name: '',
    role: '',
    text: '',
    rating: 5,
    isApproved: true
  });
  
  const { user, logout } = useAuth();

  const formatDate = (date, formatString = 'MMM dd, yyyy') => {
    try {
      if (!date) return 'N/A';
      const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
      if (!isValid(dateObj)) return 'Invalid Date';
      return format(dateObj, formatString);
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'memberships') {
        const res = await membershipsAPI.getAll();
        setMemberships(res.data.data || []);
      } else if (activeTab === 'events') {
        const res = await eventsAPI.getAll();
        setEvents(res.data.data || []);
      } else if (activeTab === 'gallery') {
        const res = await galleryAPI.getAll();
        setGalleries(res.data.data || []);
      } else if (activeTab === 'testimonials') {
        const res = await testimonialsAPI.getAll();
        setTestimonials(res.data.data || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setError(error.message);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Event Handlers
  const handleOpenEventModal = (event = null) => {
    if (event) {
      setEditingItem(event);
      setEventForm({
        title: event.title,
        description: event.description,
        date: event.date ? format(new Date(event.date), 'yyyy-MM-dd') : '',
        time: event.time,
        location: event.location,
        image: event.image,
        status: event.status
      });
    } else {
      setEditingItem(null);
      setEventForm({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        image: '',
        status: 'upcoming'
      });
    }
    setShowEventModal(true);
  };

  const handleOpenGalleryModal = (gallery = null) => {
    if (gallery) {
      setEditingItem(gallery);
      setGalleryForm({
        category: gallery.category,
        icon: gallery.icon,
        images: gallery.images
      });
    } else {
      setEditingItem(null);
      setGalleryForm({
        category: '',
        icon: '📸',
        images: [{ url: '', caption: '' }]
      });
    }
    setShowGalleryModal(true);
  };

  const handleOpenTestimonialModal = (testimonial = null) => {
    if (testimonial) {
      setEditingItem(testimonial);
      setTestimonialForm({
        name: testimonial.name,
        role: testimonial.role,
        text: testimonial.text,
        rating: testimonial.rating,
        isApproved: testimonial.isApproved
      });
    } else {
      setEditingItem(null);
      setTestimonialForm({
        name: '',
        role: '',
        text: '',
        rating: 5,
        isApproved: true
      });
    }
    setShowTestimonialModal(true);
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await eventsAPI.update(editingItem._id, eventForm);
        toast.success('Event updated successfully');
      } else {
        await eventsAPI.create(eventForm);
        toast.success('Event created successfully');
      }
      setShowEventModal(false);
      loadData();
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Failed to save event');
    }
  };

  const handleSaveGallery = async (e) => {
    e.preventDefault();
    try {
      const validImages = galleryForm.images.filter(img => img.url && img.caption);
      if (validImages.length === 0) {
        toast.error('Please add at least one image with caption');
        return;
      }
      
      const dataToSave = { ...galleryForm, images: validImages };
      
      if (editingItem) {
        await galleryAPI.update(editingItem._id, dataToSave);
        toast.success('Gallery updated successfully');
      } else {
        await galleryAPI.create(dataToSave);
        toast.success('Gallery created successfully');
      }
      setShowGalleryModal(false);
      loadData();
    } catch (error) {
      console.error('Error saving gallery:', error);
      toast.error('Failed to save gallery');
    }
  };

  const handleSaveTestimonial = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await testimonialsAPI.update(editingItem._id, testimonialForm);
        toast.success('Testimonial updated successfully');
      } else {
        await testimonialsAPI.create(testimonialForm);
        toast.success('Testimonial created successfully');
      }
      setShowTestimonialModal(false);
      loadData();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast.error('Failed to save testimonial');
    }
  };

  const handleDelete = async (id, type) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        if (type === 'membership') await membershipsAPI.delete(id);
        else if (type === 'event') await eventsAPI.delete(id);
        else if (type === 'gallery') await galleryAPI.delete(id);
        else if (type === 'testimonial') await testimonialsAPI.delete(id);
        
        toast.success(`${type} deleted successfully`);
        loadData();
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete');
      }
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await membershipsAPI.update(id, { status });
      toast.success(`Application ${status}`);
      loadData();
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update status');
    }
  };

  const viewMembershipDetails = (membership) => {
    setSelectedMembership(membership);
    setShowDetailModal(true);
  };

  const addGalleryImage = () => {
    setGalleryForm({
      ...galleryForm,
      images: [...galleryForm.images, { url: '', caption: '' }]
    });
  };

  const removeGalleryImage = (index) => {
    const newImages = galleryForm.images.filter((_, i) => i !== index);
    setGalleryForm({ ...galleryForm, images: newImages });
  };

  const updateGalleryImage = (index, field, value) => {
    const newImages = [...galleryForm.images];
    newImages[index][field] = value;
    setGalleryForm({ ...galleryForm, images: newImages });
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'} />
    ));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Not Authenticated</h1>
          <p className="text-gray-600 mb-4">Please log in to access the admin panel.</p>
          <a href="/admin/login" className="px-6 py-3 bg-maroon text-white rounded-lg hover:bg-maroon/90">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="font-playfair text-3xl md:text-4xl text-maroon mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.username || 'Admin'}</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Memberships</p>
                <p className="text-3xl font-bold text-maroon">{memberships.length}</p>
              </div>
              <FaUserCircle className="text-4xl text-maroon opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Events</p>
                <p className="text-3xl font-bold text-saffron">{events.length}</p>
              </div>
              <FaCalendar className="text-4xl text-saffron opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Gallery</p>
                <p className="text-3xl font-bold text-gold">{galleries.length}</p>
              </div>
              <FaImage className="text-4xl text-gold opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Testimonials</p>
                <p className="text-3xl font-bold text-green-600">{testimonials.length}</p>
              </div>
              <FaStar className="text-4xl text-green-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {['memberships', 'events', 'gallery', 'testimonials'].map((tab) => (
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

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-saffron border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Memberships Tab */}
        {!loading && activeTab === 'memberships' && (
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-maroon mb-6">
              Membership Applications ({memberships.length})
            </h2>
            {memberships.length === 0 ? (
              <div className="text-center py-12">
                <FaUserCircle className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No membership applications yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {memberships.map((membership) => (
                      <tr key={membership._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FaUserCircle className="text-gray-400 text-2xl mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{membership.fullName}</div>
                              <div className="text-xs text-gray-500">
                                DOB: {formatDate(membership.dateOfBirth, 'MM/dd/yyyy')}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{membership.email}</div>
                          <div className="text-xs text-gray-500">{membership.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                            {membership.membershipType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={membership.status}
                            onChange={(e) => handleUpdateStatus(membership._id, e.target.value)}
                            className={`px-3 py-1 text-xs font-semibold rounded-full border-0 cursor-pointer ${
                              membership.status === 'approved' ? 'bg-green-100 text-green-800' :
                              membership.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(membership.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-3">
                            <button
                              onClick={() => viewMembershipDetails(membership)}
                              className="text-blue-600 hover:text-blue-900 text-lg"
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                            <button
                              onClick={() => handleDelete(membership._id, 'membership')}
                              className="text-red-600 hover:text-red-900 text-lg"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Events Tab */}
        {!loading && activeTab === 'events' && (
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-maroon">
                Events ({events.length})
              </h2>
              <button
                onClick={() => handleOpenEventModal()}
                className="flex items-center gap-2 px-4 py-2 bg-saffron text-white rounded-lg hover:bg-saffron/90 transition"
              >
                <FaPlus /> Add Event
              </button>
            </div>
            {events.length === 0 ? (
              <div className="text-center py-12">
                <FaCalendar className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No events yet</p>
                <button
                  onClick={() => handleOpenEventModal()}
                  className="mt-4 px-6 py-2 bg-saffron text-white rounded-lg hover:bg-saffron/90"
                >
                  Create First Event
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <div key={event._id} className="border rounded-lg overflow-hidden hover:shadow-xl transition">
                    <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-maroon mb-2">{event.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                      <div className="text-sm text-gray-500 space-y-1 mb-4">
                        <p>📅 {formatDate(event.date)}</p>
                        <p>🕒 {event.time}</p>
                        <p>📍 {event.location}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                          event.status === 'upcoming' ? 'bg-green-100 text-green-800' :
                          event.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {event.status}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenEventModal(event)}
                            className="text-blue-600 hover:text-blue-900 text-lg"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(event._id, 'event')}
                            className="text-red-600 hover:text-red-900 text-lg"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Gallery Tab */}
        {!loading && activeTab === 'gallery' && (
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-maroon">
                Gallery Categories ({galleries.length})
              </h2>
              <button
                onClick={() => handleOpenGalleryModal()}
                className="flex items-center gap-2 px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 transition"
              >
                <FaPlus /> Add Gallery
              </button>
            </div>
            {galleries.length === 0 ? (
              <div className="text-center py-12">
                <FaImage className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No gallery categories yet</p>
                <button
                  onClick={() => handleOpenGalleryModal()}
                  className="mt-4 px-6 py-2 bg-gold text-white rounded-lg hover:bg-gold/90"
                >
                  Create First Gallery
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {galleries.map((gallery) => (
                  <div key={gallery._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-lg text-maroon flex items-center gap-2">
                        <span className="text-2xl">{gallery.icon}</span>
                        {gallery.category}
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenGalleryModal(gallery)}
                          className="text-blue-600 hover:text-blue-900 text-lg"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(gallery._id, 'gallery')}
                          className="text-red-600 hover:text-red-900 text-lg"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {gallery.images.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={img.url}
                            alt={img.caption}
                            className="w-full h-40 object-cover rounded-lg"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 text-xs rounded-b-lg opacity-0 group-hover:opacity-100 transition">
                            {img.caption}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Testimonials Tab */}
        {!loading && activeTab === 'testimonials' && (
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-maroon">
                Testimonials ({testimonials.length})
              </h2>
              <button
                onClick={() => handleOpenTestimonialModal()}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <FaPlus /> Add Testimonial
              </button>
            </div>
            {testimonials.length === 0 ? (
              <div className="text-center py-12">
                <FaStar className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No testimonials yet</p>
                <button
                  onClick={() => handleOpenTestimonialModal()}
                  className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Create First Testimonial
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonials.map((testimonial) => (
                  <div key={testimonial._id} className="border rounded-lg p-6 hover:shadow-xl transition">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-maroon">{testimonial.name}</h3>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenTestimonialModal(testimonial)}
                          className="text-blue-600 hover:text-blue-900 text-lg"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(testimonial._id, 'testimonial')}
                          className="text-red-600 hover:text-red-900 text-lg"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-1 mb-3">
                      {renderStars(testimonial.rating)}
                    </div>
                    <p className="text-gray-700 italic mb-4">&quot;{testimonial.text}&quot;</p>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        testimonial.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {testimonial.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-maroon">
                {editingItem ? 'Edit Event' : 'Add New Event'}
              </h2>
              <button onClick={() => setShowEventModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSaveEvent} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron"
                  placeholder="Sunday Meditation Session"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  required
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron"
                  placeholder="Join us for a peaceful meditation session..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <input
                    type="date"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
                  <input
                    type="text"
                    value={eventForm.time}
                    onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron"
                    placeholder="10:00 AM - 11:30 AM"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                <input
                  type="text"
                  value={eventForm.location}
                  onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron"
                  placeholder="Main Meditation Hall"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL *</label>
                <input
                  type="url"
                  value={eventForm.image}
                  onChange={(e) => setEventForm({ ...eventForm, image: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron"
                  placeholder="https://images.unsplash.com/..."
                />
                {eventForm.image && (
                  <img src={eventForm.image} alt="Preview" className="mt-2 w-full h-48 object-cover rounded-lg" />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                <select
                  value={eventForm.status}
                  onChange={(e) => setEventForm({ ...eventForm, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-saffron text-white rounded-lg hover:bg-saffron/90 transition font-semibold"
                >
                  {editingItem ? 'Update Event' : 'Create Event'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {showGalleryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-maroon">
                {editingItem ? 'Edit Gallery' : 'Add New Gallery'}
              </h2>
              <button onClick={() => setShowGalleryModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSaveGallery} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category Name *</label>
                <input
                  type="text"
                  value={galleryForm.category}
                  onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                  placeholder="Buddha Purnima 2024"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon/Emoji *</label>
                <input
                  type="text"
                  value={galleryForm.icon}
                  onChange={(e) => setGalleryForm({ ...galleryForm, icon: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                  placeholder="🎉"
                  maxLength="2"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Images *</label>
                  <button
                    type="button"
                    onClick={addGalleryImage}
                    className="text-sm text-gold hover:text-gold/80 flex items-center gap-1"
                  >
                    <FaPlus /> Add Image
                  </button>
                </div>
                <div className="space-y-3">
                  {galleryForm.images.map((image, index) => (
                    <div key={index} className="border border-gray-300 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-gray-700">Image {index + 1}</span>
                        {galleryForm.images.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FaTimes />
                          </button>
                        )}
                      </div>
                      <input
                        type="url"
                        value={image.url}
                        onChange={(e) => updateGalleryImage(index, 'url', e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-gold"
                        placeholder="https://images.unsplash.com/..."
                      />
                      <input
                        type="text"
                        value={image.caption}
                        onChange={(e) => updateGalleryImage(index, 'caption', e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                        placeholder="Image caption"
                      />
                      {image.url && (
                        <img src={image.url} alt="Preview" className="mt-2 w-full h-32 object-cover rounded-lg" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gold text-white rounded-lg hover:bg-gold/90 transition font-semibold"
                >
                  {editingItem ? 'Update Gallery' : 'Create Gallery'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowGalleryModal(false)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Testimonial Modal */}
      {showTestimonialModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-maroon">
                {editingItem ? 'Edit Testimonial' : 'Add New Testimonial'}
              </h2>
              <button onClick={() => setShowTestimonialModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSaveTestimonial} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  value={testimonialForm.name}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Sarah Johnson"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                <input
                  type="text"
                  value={testimonialForm.role}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Regular Member"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Testimonial Text *</label>
                <textarea
                  value={testimonialForm.text}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, text: e.target.value })}
                  required
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Share your experience..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating *</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setTestimonialForm({ ...testimonialForm, rating: star })}
                      className="text-3xl focus:outline-none"
                    >
                      <FaStar className={star <= testimonialForm.rating ? 'text-yellow-400' : 'text-gray-300'} />
                    </button>
                  ))}
                  <span className="ml-2 text-gray-600">({testimonialForm.rating} star{testimonialForm.rating !== 1 ? 's' : ''})</span>
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={testimonialForm.isApproved}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, isApproved: e.target.checked })}
                    className="w-5 h-5 text-green-600 focus:ring-green-500 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Approved for display</span>
                </label>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                >
                  {editingItem ? 'Update Testimonial' : 'Create Testimonial'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowTestimonialModal(false)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Membership Detail Modal (unchanged) */}
      {showDetailModal && selectedMembership && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-maroon">Membership Details</h2>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-500 hover:text-gray-700 text-3xl leading-none">
                &times;
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-maroon mb-3">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium">{selectedMembership.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date of Birth</p>
                    <p className="font-medium">{formatDate(selectedMembership.dateOfBirth, 'MMMM dd, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedMembership.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{selectedMembership.phone}</p>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-medium">{selectedMembership.address}</p>
                    <p className="font-medium">{selectedMembership.city}, {selectedMembership.state} {selectedMembership.zipCode}</p>
                    <p className="font-medium">{selectedMembership.country}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-maroon mb-3">Membership Type</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-semibold capitalize">
                    {selectedMembership.membershipType}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-maroon mb-3">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Contact Name</p>
                    <p className="font-medium">{selectedMembership.emergencyContactName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Relationship</p>
                    <p className="font-medium">{selectedMembership.emergencyContactRelationship}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Contact Phone</p>
                    <p className="font-medium">{selectedMembership.emergencyContactPhone}</p>
                  </div>
                </div>
              </div>
              {selectedMembership.interests && Object.values(selectedMembership.interests).some(v => v) && (
                <div>
                  <h3 className="text-xl font-semibold text-maroon mb-3">Areas of Interest</h3>
                  <div className="bg-gray-50 p-4 rounded-lg flex flex-wrap gap-2">
                    {selectedMembership.interests.meditation && <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Meditation</span>}
                    {selectedMembership.interests.dharma && <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Dharma Talks</span>}
                    {selectedMembership.interests.retreats && <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Retreats</span>}
                    {selectedMembership.interests.volunteering && <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Volunteering</span>}
                    {selectedMembership.interests.youth && <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Youth Programs</span>}
                  </div>
                </div>
              )}
            </div>
            <div className="sticky bottom-0 bg-white border-t px-6 py-4 z-10">
              <button onClick={() => setShowDetailModal(false)} className="w-full py-3 bg-maroon text-white rounded-lg hover:bg-maroon hover:opacity-90 transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;