import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { membershipsAPI, eventsAPI, galleryAPI, testimonialsAPI } from '../services/api';
import { FaTrash, FaUserCircle, FaSignOutAlt, FaCalendar, FaImage, FaStar, FaEye } from 'react-icons/fa';
import { format, isValid, parseISO } from 'date-fns';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('memberships');
  const [memberships, setMemberships] = useState([]);
  const [events, setEvents] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { user, logout } = useAuth();

  // Helper function to safely format dates
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
      console.log('📡 Loading data for tab:', activeTab);
      
      if (activeTab === 'memberships') {
        const res = await membershipsAPI.getAll();
        console.log('Raw memberships response:', res);
        setMemberships(res.data.data || []);
        console.log('✅ Loaded', res.data.data?.length || 0, 'memberships');
      } else if (activeTab === 'events') {
        const res = await eventsAPI.getAll();
        setEvents(res.data.data || []);
        console.log('✅ Loaded', res.data.data?.length || 0, 'events');
      } else if (activeTab === 'gallery') {
        const res = await galleryAPI.getAll();
        setGalleries(res.data.data || []);
        console.log('✅ Loaded', res.data.data?.length || 0, 'galleries');
      } else if (activeTab === 'testimonials') {
        const res = await testimonialsAPI.getAll();
        setTestimonials(res.data.data || []);
        console.log('✅ Loaded', res.data.data?.length || 0, 'testimonials');
      }
    } catch (error) {
      console.error('❌ Error loading data:', error);
      setError(error.message);
      toast.error('Failed to load data: ' + error.message);
    } finally {
      setLoading(false);
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
                <p className="text-gray-400 text-sm mt-2">Applications will appear here once users submit them</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emergency</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                          <div className="text-sm text-gray-900">{membership.city}, {membership.state}</div>
                          <div className="text-xs text-gray-500">{membership.zipCode}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                            {membership.membershipType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{membership.emergencyContactName}</div>
                          <div className="text-xs text-gray-500">{membership.emergencyContactRelationship}</div>
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
            <h2 className="text-2xl font-bold text-maroon mb-6">
              Events ({events.length})
            </h2>
            {events.length === 0 ? (
              <div className="text-center py-12">
                <FaCalendar className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No events yet</p>
                <p className="text-gray-400 text-sm mt-2">Events will appear here once created</p>
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
                        <p className="flex items-center gap-2">
                          <FaCalendar className="text-saffron" />
                          {formatDate(event.date)}
                        </p>
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
                        <button
                          onClick={() => handleDelete(event._id, 'event')}
                          className="text-red-600 hover:text-red-900 text-lg"
                        >
                          <FaTrash />
                        </button>
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
            <h2 className="text-2xl font-bold text-maroon mb-6">
              Gallery Categories ({galleries.length})
            </h2>
            {galleries.length === 0 ? (
              <div className="text-center py-12">
                <FaImage className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No gallery categories yet</p>
                <p className="text-gray-400 text-sm mt-2">Gallery items will appear here once created</p>
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
                      <button
                        onClick={() => handleDelete(gallery._id, 'gallery')}
                        className="text-red-600 hover:text-red-900 text-lg"
                      >
                        <FaTrash />
                      </button>
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
            <h2 className="text-2xl font-bold text-maroon mb-6">
              Testimonials ({testimonials.length})
            </h2>
            {testimonials.length === 0 ? (
              <div className="text-center py-12">
                <FaStar className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No testimonials yet</p>
                <p className="text-gray-400 text-sm mt-2">Testimonials will appear here once submitted</p>
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
                      <button
                        onClick={() => handleDelete(testimonial._id, 'testimonial')}
                        className="text-red-600 hover:text-red-900 text-lg"
                      >
                        <FaTrash />
                      </button>
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

      {/* Membership Detail Modal */}
      {showDetailModal && selectedMembership && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-maroon">Membership Details</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Personal Information */}
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

              {/* Membership Type */}
              <div>
                <h3 className="text-xl font-semibold text-maroon mb-3">Membership Type</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-semibold capitalize">
                    {selectedMembership.membershipType}
                  </span>
                </div>
              </div>

              {/* Emergency Contact */}
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

              {/* Additional Information */}
              <div>
                <h3 className="text-xl font-semibold text-maroon mb-3">Additional Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  {selectedMembership.hearAboutUs && (
                    <div>
                      <p className="text-sm text-gray-600">How they heard about us</p>
                      <p className="font-medium capitalize">{selectedMembership.hearAboutUs.replace('-', ' ')}</p>
                    </div>
                  )}
                  
                  {selectedMembership.interests && Object.values(selectedMembership.interests).some(v => v) && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Areas of Interest</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedMembership.interests.meditation && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Meditation</span>
                        )}
                        {selectedMembership.interests.dharma && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Dharma Talks</span>
                        )}
                        {selectedMembership.interests.retreats && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Retreats</span>
                        )}
                        {selectedMembership.interests.volunteering && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Volunteering</span>
                        )}
                        {selectedMembership.interests.youth && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Youth Programs</span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {selectedMembership.comments && (
                    <div>
                      <p className="text-sm text-gray-600">Comments</p>
                      <p className="font-medium">{selectedMembership.comments}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Status and Date */}
              <div>
                <h3 className="text-xl font-semibold text-maroon mb-3">Application Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                      selectedMembership.status === 'approved' ? 'bg-green-100 text-green-800' :
                      selectedMembership.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedMembership.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Submitted On</p>
                    <p className="font-medium">{formatDate(selectedMembership.createdAt, 'MMMM dd, yyyy h:mm a')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t px-6 py-4 z-10">
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full py-3 bg-maroon text-white rounded-lg hover:bg-maroon hover:opacity-90 transition"
              >
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