import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Search, Plus } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import axiosInstance from '../api/axios';
import { formatCurrency, getStatusColor, getStatusText } from '../utils/helpers';

const Parcels = () => {
  const [parcels, setParcels] = useState([]);
  const [tab, setTab] = useState('sent'); // sent | carrying | all
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchParcels();
  }, [tab]);

  const fetchParcels = async () => {
    setLoading(true);
    try {
      let response;
      if (tab === 'sent') {
        response = await axiosInstance.get('/parcels/my/sent');
      } else if (tab === 'carrying') {
        response = await axiosInstance.get('/parcels/my/carrying');
      } else {
        response = await axiosInstance.get('/parcels');
      }
      setParcels(response.data);
    } catch (error) {
      console.error('Error fetching parcels:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredParcels = parcels.filter(parcel =>
    parcel.pickupCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    parcel.dropCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    parcel.parcelDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-20">
      <Header />

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Package className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Parcels</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your parcels</p>
            </div>
          </div>
          <Link to="/parcels/send" className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            <span className="hidden sm:inline">Send Parcel</span>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setTab('sent')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              tab === 'sent'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Sent
          </button>
          <button
            onClick={() => setTab('carrying')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              tab === 'carrying'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Carrying
          </button>
          <button
            onClick={() => setTab('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              tab === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            All Requests
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by city or description..."
            className="input-field pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Parcels List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : filteredParcels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredParcels.map((parcel) => (
              <Link
                key={parcel._id}
                to={`/parcels/${parcel._id}`}
                className="card hover:border-primary-500 transition-colors cursor-pointer"
              >
                {parcel.parcelImage && (
                  <img
                    src={parcel.parcelImage}
                    alt="Parcel"
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                )}
                
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-lg">{parcel.pickupCity} → {parcel.dropCity}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{parcel.parcelDescription}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(parcel.status)}`}>
                    {getStatusText(parcel.status)}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-xs text-gray-500">Reward</p>
                    <p className="font-bold text-primary-600">{formatCurrency(parcel.rewardAmount)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Size</p>
                    <p className="font-medium capitalize">{parcel.parcelSize}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Package size={64} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No parcels found</p>
            <p className="text-sm mt-2">Try adjusting your search or create a new parcel request</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Parcels;
