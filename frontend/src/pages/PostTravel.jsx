import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import TermsModal from '../components/TermsModal';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axios';
import MapComponent from '../components/MapComponent';
import { geocodeCity } from '../utils/geocoding';

const PostTravel = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fromCity: '',
    toCity: '',
    date: '',
    time: '',
    vehicleType: 'car',
    availableSpace: 'small',
    fromCoordinates: null,
    toCoordinates: null
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const navigate = useNavigate();

  const handleCityBlur = async (field, value) => {
    if (!value) return;
    const coords = await geocodeCity(value);
    if (coords) {
      if (field === 'fromCity') {
        setFormData(prev => ({ ...prev, fromCoordinates: coords }));
      } else {
        setFormData(prev => ({ ...prev, toCoordinates: coords }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Check if user has accepted terms
    if (!user?.termsAccepted) {
      setShowTerms(true);
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post('/travel', formData);
      navigate('/travel');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create travel post');
    } finally {
      setLoading(false);
    }
  };

  const handleTermsAccepted = () => {
    setShowTerms(false);
    window.location.reload(); // Refresh to update user context
  };

  return (
    <div className="min-h-screen pb-20">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary-600 p-2 rounded-lg">
            <Plane className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Post Travel</h1>
            <p className="text-gray-600 dark:text-gray-400">Share your travel route</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          {error && (
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <MapComponent
            pickup={formData.fromCoordinates}
            drop={formData.toCoordinates}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">From City *</label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="Mumbai"
                value={formData.fromCity}
                onChange={(e) => setFormData({ ...formData, fromCity: e.target.value })}
                onBlur={(e) => handleCityBlur('fromCity', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">To City *</label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="Delhi"
                value={formData.toCity}
                onChange={(e) => setFormData({ ...formData, toCity: e.target.value })}
                onBlur={(e) => handleCityBlur('toCity', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Travel Date *</label>
              <input
                type="date"
                required
                className="input-field"
                min={new Date().toISOString().split('T')[0]}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Travel Time *</label>
              <input
                type="time"
                required
                className="input-field"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Vehicle Type *</label>
            <select
              className="input-field"
              value={formData.vehicleType}
              onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
            >
              <option value="car">Car</option>
              <option value="train">Train</option>
              <option value="bus">Bus</option>
              <option value="flight">Flight</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Available Space *</label>
            <select
              className="input-field"
              value={formData.availableSpace}
              onChange={(e) => setFormData({ ...formData, availableSpace: e.target.value })}
            >
              <option value="small">Small (bag-sized items)</option>
              <option value="medium">Medium (small boxes)</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/travel')}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-50"
            >
              {loading ? 'Posting...' : 'Post Travel'}
            </button>
          </div>
        </form>
      </div>

      {showTerms && (
        <TermsModal
          onClose={() => setShowTerms(false)}
          onAccept={handleTermsAccepted}
        />
      )}

      <BottomNav />
    </div>
  );
};

export default PostTravel;
