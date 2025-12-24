import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Package, MapPin, User, Clock, MessageSquare, Star } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axios';
import { formatCurrency, formatDateTime, getStatusColor, getStatusText } from '../utils/helpers';

const ParcelDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [parcel, setParcel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');

  useEffect(() => {
    fetchParcel();
  }, [id]);

  const fetchParcel = async () => {
    try {
      const { data } = await axiosInstance.get(`/parcels/${id}`);
      setParcel(data);
    } catch (error) {
      console.error('Error fetching parcel:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setActionLoading(true);
    try {
      const { data } = await axiosInstance.put(`/parcels/${id}/status`, { status: newStatus });
      setParcel(data);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitRating = async () => {
    setActionLoading(true);
    try {
      await axiosInstance.post('/ratings', {
        parcelId: parcel._id,
        travelerId: parcel.traveler._id,
        rating,
        review,
      });
      alert('Rating submitted successfully!');
      setShowRating(false);
      fetchParcel();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit rating');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!parcel) {
    return <div className="min-h-screen flex items-center justify-center">Parcel not found</div>;
  }

  const isSender = parcel.sender._id === user._id;
  const isTraveler = parcel.traveler && parcel.traveler._id === user._id;

  return (
    <div className="min-h-screen pb-20">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="card">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary-600 p-3 rounded-lg">
                <Package className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Parcel Details</h1>
                <p className="text-gray-600 dark:text-gray-400">Track your delivery</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(parcel.status)}`}>
              {getStatusText(parcel.status)}
            </span>
          </div>

          {/* Parcel Image */}
          {parcel.parcelImage && (
            <img
              src={parcel.parcelImage}
              alt="Parcel"
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}

          {/* Route */}
          <div className="mb-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <MapPin className="text-primary-600" size={24} />
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">Route</p>
                <p className="text-xl font-bold">{parcel.pickupCity} → {parcel.dropCity}</p>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Description</p>
              <p className="font-medium">{parcel.parcelDescription}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Reward Amount</p>
              <p className="text-xl font-bold text-primary-600">{formatCurrency(parcel.rewardAmount)}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Parcel Size</p>
              <p className="font-medium capitalize">{parcel.parcelSize}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Created</p>
              <p className="font-medium">{formatDateTime(parcel.createdAt)}</p>
            </div>
          </div>

          {/* Sender Info */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="text-blue-600" size={20} />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Sender</p>
                  <p className="font-semibold">{parcel.sender.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{parcel.sender.phone}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm flex items-center gap-1">
                  <Star className="text-yellow-500" size={16} fill="currentColor" />
                  {parcel.sender.rating.toFixed(1)}
                </p>
              </div>
            </div>
          </div>

          {/* Traveler Info */}
          {parcel.traveler && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className="text-green-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Traveler</p>
                    <p className="font-semibold">{parcel.traveler.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{parcel.traveler.phone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm flex items-center gap-1">
                    <Star className="text-yellow-500" size={16} fill="currentColor" />
                    {parcel.traveler.rating.toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          {(parcel.acceptedAt || parcel.pickedUpAt || parcel.deliveredAt || parcel.completedAt) && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Timeline</h3>
              <div className="space-y-2">
                {parcel.acceptedAt && (
                  <div className="flex items-center gap-3 text-sm">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">Accepted:</span>
                    <span className="font-medium">{formatDateTime(parcel.acceptedAt)}</span>
                  </div>
                )}
                {parcel.pickedUpAt && (
                  <div className="flex items-center gap-3 text-sm">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">Picked Up:</span>
                    <span className="font-medium">{formatDateTime(parcel.pickedUpAt)}</span>
                  </div>
                )}
                {parcel.deliveredAt && (
                  <div className="flex items-center gap-3 text-sm">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">Delivered:</span>
                    <span className="font-medium">{formatDateTime(parcel.deliveredAt)}</span>
                  </div>
                )}
                {parcel.completedAt && (
                  <div className="flex items-center gap-3 text-sm">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">Completed:</span>
                    <span className="font-medium">{formatDateTime(parcel.completedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3">
            {/* Chat Button */}
            {parcel.traveler && (isSender || isTraveler) && (
              <Link
                to={`/messages/${parcel._id}`}
                className="btn-secondary text-center flex items-center justify-center gap-2"
              >
                <MessageSquare size={20} />
                Chat
              </Link>
            )}

            {/* Status Actions */}
            {isTraveler && parcel.status === 'accepted' && (
              <button
                onClick={() => handleStatusUpdate('picked_up')}
                disabled={actionLoading}
                className="btn-primary"
              >
                Mark as Picked Up
              </button>
            )}

            {isTraveler && parcel.status === 'picked_up' && (
              <button
                onClick={() => handleStatusUpdate('delivered')}
                disabled={actionLoading}
                className="btn-primary"
              >
                Mark as Delivered
              </button>
            )}

            {isSender && parcel.status === 'delivered' && (
              <button
                onClick={() => handleStatusUpdate('completed')}
                disabled={actionLoading}
                className="btn-primary"
              >
                Confirm & Complete
              </button>
            )}

            {/* Rating */}
            {isSender && parcel.status === 'completed' && !showRating && (
              <button
                onClick={() => setShowRating(true)}
                className="btn-secondary"
              >
                Rate Traveler
              </button>
            )}

            {showRating && (
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-semibold mb-3">Rate Your Experience</h4>
                <div className="flex gap-2 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1"
                    >
                      <Star
                        size={32}
                        className={star <= rating ? 'text-yellow-500' : 'text-gray-300'}
                        fill={star <= rating ? 'currentColor' : 'none'}
                      />
                    </button>
                  ))}
                </div>
                <textarea
                  className="input-field mb-3"
                  rows="3"
                  placeholder="Write a review (optional)"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowRating(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitRating}
                    disabled={actionLoading}
                    className="flex-1 btn-primary"
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default ParcelDetails;
