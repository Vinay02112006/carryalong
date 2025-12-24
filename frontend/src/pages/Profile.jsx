import { useState, useEffect } from 'react';
import { User, Mail, Phone, CreditCard, Star, Edit, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/helpers';
import axiosInstance from '../api/axios';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState('info'); // 'info', 'ratings', 'payments'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'ratings') {
      fetchRatings();
    } else if (activeTab === 'payments') {
      fetchPayments();
    }
  }, [activeTab]);

  const fetchRatings = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/ratings/user/${user._id}`);
      setRatings(response.data);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/payments/my');
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary-600 p-3 rounded-lg">
              <User className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your account</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <Edit size={20} />
            <span className="hidden sm:inline">Edit</span>
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Star className="text-yellow-500" size={20} fill="currentColor" />
                <span className="font-semibold text-gray-900 dark:text-white">{user?.rating.toFixed(1)}</span>
                <span className="text-gray-600 dark:text-gray-400">({user?.totalRatings} ratings)</span>
              </div>
            </div>
          </div>

          {/* Earnings Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="text-green-600" size={20} />
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Earnings</p>
              </div>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(user?.earnings || 0)}</p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="text-blue-600" size={20} />
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed Deliveries</p>
              </div>
              <p className="text-2xl font-bold text-blue-600">{user?.totalRatings || 0}</p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Star className="text-purple-600" size={20} />
                <p className="text-sm text-gray-600 dark:text-gray-400">Average Rating</p>
              </div>
              <p className="text-2xl font-bold text-purple-600">{user?.rating.toFixed(1) || '0.0'}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700 mb-6">
            <button
              onClick={() => setActiveTab('info')}
              className={`pb-3 px-2 font-medium transition-colors ${
                activeTab === 'info'
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Contact Info
            </button>
            <button
              onClick={() => setActiveTab('ratings')}
              className={`pb-3 px-2 font-medium transition-colors ${
                activeTab === 'ratings'
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Ratings ({ratings.length})
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`pb-3 px-2 font-medium transition-colors ${
                activeTab === 'payments'
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Payments ({payments.length})
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Mail className="text-primary-600" size={20} />
                <div className="flex-1">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Email</p>
                  <p className="font-medium text-gray-900 dark:text-white">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Phone className="text-primary-600" size={20} />
                <div className="flex-1">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Phone</p>
                  <p className="font-medium text-gray-900 dark:text-white">{user?.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <CreditCard className="text-primary-600" size={20} />
                <div className="flex-1">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Government ID</p>
                  <p className="font-medium text-gray-900 dark:text-white">{user?.governmentId}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ratings' && (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                </div>
              ) : ratings.length === 0 ? (
                <div className="text-center py-8">
                  <Star className="mx-auto text-gray-400 dark:text-gray-600 mb-4" size={48} />
                  <p className="text-gray-600 dark:text-gray-400">No ratings yet</p>
                </div>
              ) : (
                ratings.map((rating) => (
                  <div key={rating._id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {rating.rater?.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(rating.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < rating.rating ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}
                            fill={i < rating.rating ? 'currentColor' : 'none'}
                          />
                        ))}
                      </div>
                    </div>
                    {rating.review && (
                      <p className="text-gray-700 dark:text-gray-300">{rating.review}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                </div>
              ) : payments.length === 0 ? (
                <div className="text-center py-8">
                  <DollarSign className="mx-auto text-gray-400 dark:text-gray-600 mb-4" size={48} />
                  <p className="text-gray-600 dark:text-gray-400">No payment history</p>
                </div>
              ) : (
                payments.map((payment) => (
                  <div key={payment._id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {formatCurrency(payment.amount)}
                          </p>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            payment.status === 'completed' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : payment.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {payment.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {payment.parcel?.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {formatDate(payment.createdAt)}
                          </span>
                          <span>Method: {payment.method}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
