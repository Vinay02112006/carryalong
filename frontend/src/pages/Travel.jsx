import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plane, MapPin, Calendar, DollarSign, Package, Plus } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import axiosInstance from '../api/axios';

const Travel = () => {
  const [travels, setTravels] = useState([]);
  const [myTravels, setMyTravels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'my'

  useEffect(() => {
    fetchTravels();
  }, []);

  const fetchTravels = async () => {
    try {
      setLoading(true);
      const [allResponse, myResponse] = await Promise.all([
        axiosInstance.get('/travel'),
        axiosInstance.get('/travel/my')
      ]);
      setTravels(allResponse.data);
      setMyTravels(myResponse.data);
    } catch (error) {
      console.error('Error fetching travels:', error);
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

  const TravelCard = ({ travel, isMine }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-full">
            <Plane className="text-primary-600 dark:text-primary-400" size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {travel.from} → {travel.to}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              by {travel.traveler?.name}
            </p>
          </div>
        </div>
        {isMine && (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Your Travel
          </span>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <Calendar size={16} className="mr-2" />
          <span className="text-sm">Departure: {formatDate(travel.departureDate)}</span>
        </div>
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <Package size={16} className="mr-2" />
          <span className="text-sm">Space: {travel.availableSpace} kg</span>
        </div>
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <DollarSign size={16} className="mr-2" />
          <span className="text-sm">Price: ${travel.pricePerKg}/kg</span>
        </div>
      </div>

      {travel.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {travel.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
          travel.status === 'active' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
        }`}>
          {travel.status}
        </span>
        <Link
          to={`/travel/${travel._id}`}
          className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
        >
          View Details →
        </Link>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
        <BottomNav />
      </div>
    );
  }

  const displayTravels = activeTab === 'all' ? travels : myTravels;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Travel Routes
          </h1>
          <Link
            to="/travel/post"
            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus size={20} />
            <span>Post Travel</span>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-3 px-2 font-medium transition-colors ${
              activeTab === 'all'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            All Travels ({travels.length})
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={`pb-3 px-2 font-medium transition-colors ${
              activeTab === 'my'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            My Travels ({myTravels.length})
          </button>
        </div>

        {/* Travel List */}
        {displayTravels.length === 0 ? (
          <div className="text-center py-12">
            <Plane className="mx-auto text-gray-400 dark:text-gray-600 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No travels found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {activeTab === 'my' 
                ? "You haven't posted any travel routes yet." 
                : "No available travel routes at the moment."}
            </p>
            {activeTab === 'my' && (
              <Link
                to="/travel/post"
                className="inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              >
                <Plus size={20} />
                <span>Post your first travel route</span>
              </Link>
            )}
          </div>
        ) : (
          <div>
            {displayTravels.map((travel) => (
              <TravelCard 
                key={travel._id} 
                travel={travel} 
                isMine={activeTab === 'my'}
              />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Travel;
