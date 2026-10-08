import { useEffect, useState } from 'react';
import { farmerService } from '../../services/farmerService';
import useAuthStore from '../../store/authStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate } from '../../utils/helpers';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  CalendarIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline';

const FarmerProfile = () => {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchProfile();
  }, []);
  
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await farmerService.getProfile();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <LoadingSpinner message="Loading profile..." />;
  }
  
  const profileInfo = [
    { icon: UserIcon, label: 'Full Name', value: profile?.name || user?.name },
    { icon: EnvelopeIcon, label: 'Email', value: profile?.email || user?.email },
    { icon: PhoneIcon, label: 'Phone', value: profile?.phone || user?.phone },
    { icon: MapPinIcon, label: 'Village', value: profile?.village || user?.village },
    { icon: CalendarIcon, label: 'Member Since', value: formatDate(profile?.createdAt) },
    { icon: ChartBarIcon, label: 'Total Predictions', value: profile?.totalPredictions || 0 },
  ];
  
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">👤 My Profile</h2>
      
      {/* Profile Header */}
      <div className="card bg-gradient-to-r from-green-600 to-green-700 text-white mb-6">
        <div className="flex items-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold mr-6">
            {user?.name?.charAt(0)?.toUpperCase() || 'F'}
          </div>
          <div>
            <h3 className="text-2xl font-bold">{profile?.name || user?.name}</h3>
            <p className="text-green-100">Farmer</p>
          </div>
        </div>
      </div>
      
      {/* Profile Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profileInfo.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="card flex items-center">
              <div className="p-3 bg-green-50 rounded-lg mr-4">
                <Icon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="font-semibold text-gray-800">{item.value || 'N/A'}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/farmer/predict"
          className="card hover:shadow-lg transition text-center"
        >
          <span className="text-4xl mb-2 inline-block">🌿</span>
          <h4 className="font-semibold">Analyze New Leaf</h4>
          <p className="text-sm text-gray-500">Upload image for disease detection</p>
        </Link>
        <Link
          to="/farmer/history"
          className="card hover:shadow-lg transition text-center"
        >
          <span className="text-4xl mb-2 inline-block">📊</span>
          <h4 className="font-semibold">View History</h4>
          <p className="text-sm text-gray-500">Check your prediction history</p>
        </Link>
      </div>
    </div>
  );
};

// Need to import Link
import { Link } from 'react-router-dom';

export default FarmerProfile;