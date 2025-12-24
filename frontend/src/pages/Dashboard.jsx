import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Plane, TrendingUp } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axios';
import { formatCurrency, getStatusColor, getStatusText } from '../utils/helpers';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    sentParcels: 0,
    carryingParcels: 0,
    activeTravels: 0,
  });
  const [recentParcels, setRecentParcels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [sentRes, carryingRes, travelsRes] = await Promise.all([
        axiosInstance.get('/parcels/my/sent'),
        axiosInstance.get('/parcels/my/carrying'),
        axiosInstance.get('/travel/my/posts'),
      ]);

      setStats({
        sentParcels: sentRes.data.length,
        carryingParcels: carryingRes.data.length,
        activeTravels: travelsRes.data.filter(t => t.status === 'active').length,
      });

      // Combine and sort recent parcels
      const allParcels = [...sentRes.data, ...carryingRes.data]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentParcels(allParcels);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <Header />

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 dark:text-gray-400">Here's what's happening with your deliveries</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Sent Parcels</p>
                <p className="text-2xl font-bold mt-1">{stats.sentParcels}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <Package className="text-blue-600 dark:text-blue-300" size={24} />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Carrying</p>
                <p className="text-2xl font-bold mt-1">{stats.carryingParcels}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                <Plane className="text-green-600 dark:text-green-300" size={24} />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Earnings</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(user?.earnings || 0)}</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
                <TrendingUp className="text-purple-600 dark:text-purple-300" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card mb-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/parcels/send" className="btn-primary text-center">
              Send Parcel
            </Link>
            <Link to="/travel/post" className="btn-secondary text-center">
              Post Travel
            </Link>
          </div>
        </div>

        {/* Recent Parcels */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Parcels</h2>
            <Link to="/parcels" className="text-primary-600 text-sm hover:underline">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : recentParcels.length > 0 ? (
            <div className="space-y-3">
              {recentParcels.map((parcel) => (
                <Link
                  key={parcel._id}
                  to={`/parcels/${parcel._id}`}
                  className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{parcel.pickupCity} → {parcel.dropCity}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{parcel.parcelDescription}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(parcel.status)}`}>
                      {getStatusText(parcel.status)}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-primary-600">{formatCurrency(parcel.rewardAmount)}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package size={48} className="mx-auto mb-2 opacity-50" />
              <p>No parcels yet</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
