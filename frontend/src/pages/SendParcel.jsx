import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import axiosInstance from '../api/axios';

const SendParcel = () => {
  const [formData, setFormData] = useState({
    pickupCity: '',
    dropCity: '',
    parcelSize: 'small',
    parcelDescription: '',
    rewardAmount: '',
    parcelImage: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.rewardAmount > 10000) {
      setError('Maximum reward amount is ₹10,000');
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post('/parcels', formData);
      navigate('/parcels');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create parcel request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary-600 p-2 rounded-lg">
            <Package className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Send Parcel</h1>
            <p className="text-gray-600 dark:text-gray-400">Create a new parcel request</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          {error && (
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Pickup City *</label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="Mumbai"
                value={formData.pickupCity}
                onChange={(e) => setFormData({ ...formData, pickupCity: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Drop City *</label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="Delhi"
                value={formData.dropCity}
                onChange={(e) => setFormData({ ...formData, dropCity: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Parcel Size *</label>
            <select
              className="input-field"
              value={formData.parcelSize}
              onChange={(e) => setFormData({ ...formData, parcelSize: e.target.value })}
            >
              <option value="small">Small (fits in bag)</option>
              <option value="medium">Medium (small box)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Parcel Description *</label>
            <textarea
              required
              className="input-field"
              rows="3"
              placeholder="Describe your parcel (books, documents, etc.)"
              value={formData.parcelDescription}
              onChange={(e) => setFormData({ ...formData, parcelDescription: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-1">⚠️ Prohibited: drugs, weapons, alcohol, explosives</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Reward Amount (₹) *</label>
            <input
              type="number"
              required
              min="1"
              max="10000"
              className="input-field"
              placeholder="500"
              value={formData.rewardAmount}
              onChange={(e) => setFormData({ ...formData, rewardAmount: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-1">Maximum: ₹10,000</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Parcel Image URL (Optional)</label>
            <input
              type="url"
              className="input-field"
              placeholder="https://example.com/image.jpg"
              value={formData.parcelImage}
              onChange={(e) => setFormData({ ...formData, parcelImage: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/parcels')}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Request'}
            </button>
          </div>
        </form>
      </div>

      <BottomNav />
    </div>
  );
};

export default SendParcel;
