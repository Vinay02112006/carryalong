import { useState, useEffect } from 'react';
import { User, Mail, Phone, CreditCard, Star, Edit } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/helpers';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen pb-20">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary-600 p-3 rounded-lg">
              <User className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">My Profile</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your account</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn-secondary flex items-center gap-2"
          >
            <Edit size={20} />
            <span className="hidden sm:inline">Edit</span>
          </button>
        </div>

        {/* Profile Card */}
        <div className="card mb-6">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Star className="text-yellow-500" size={20} fill="currentColor" />
                <span className="font-semibold">{user?.rating.toFixed(1)}</span>
                <span className="text-gray-600 dark:text-gray-400">({user?.totalRatings} ratings)</span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Mail className="text-primary-600" size={20} />
              <div className="flex-1">
                <p className="text-xs text-gray-600 dark:text-gray-400">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Phone className="text-primary-600" size={20} />
              <div className="flex-1">
                <p className="text-xs text-gray-600 dark:text-gray-400">Phone</p>
                <p className="font-medium">{user?.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <CreditCard className="text-primary-600" size={20} />
              <div className="flex-1">
                <p className="text-xs text-gray-600 dark:text-gray-400">Government ID</p>
                <p className="font-medium">{user?.governmentId}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Earnings Card */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Earnings Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Earnings</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(user?.earnings || 0)}</p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Completed Deliveries</p>
              <p className="text-2xl font-bold text-blue-600">{user?.totalRatings || 0}</p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Average Rating</p>
              <p className="text-2xl font-bold text-purple-600">{user?.rating.toFixed(1) || '0.0'}</p>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
