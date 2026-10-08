import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { farmerService } from '../../services/farmerService';
import useAuthStore from '../../store/authStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatCard from '../../components/common/StatCard';
import { formatDate } from '../../utils/helpers';
import { getImageUrl } from '../../utils/helpers';

const FarmerDashboard = () => {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [recentPredictions, setRecentPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [profileData, historyData] = await Promise.all([
        farmerService.getProfile(),
        farmerService.getHistory(0, 5),
      ]);
      
      setProfile(profileData);
      setRecentPredictions(Array.isArray(historyData) ? historyData : historyData.content || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }
  
  const healthyCount = recentPredictions.filter(p => p.predictedDisease === 'Healthy Leaf').length;
  const diseaseCount = recentPredictions.filter(p => p.predictedDisease !== 'Healthy Leaf').length;
  
  return (
    <div>
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-green-100">
          Ready to check your chili plants? Upload a leaf image for instant diagnosis.
        </p>
        <Link
          to="/farmer/predict"
          className="mt-4 inline-flex items-center bg-white text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition"
        >
          🌿 Analyze New Leaf
        </Link>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon="📊"
          title="Total Predictions"
          value={profile?.totalPredictions || 0}
          color="green"
        />
        <StatCard
          icon="✅"
          title="Healthy Leaves"
          value={healthyCount}
          color="green"
        />
        <StatCard
          icon="⚠️"
          title="Diseases Detected"
          value={diseaseCount}
          color="red"
        />
      </div>
      
      {/* Recent Predictions */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Recent Predictions</h3>
          <Link
            to="/farmer/history"
            className="text-green-600 hover:text-green-700 text-sm font-medium"
          >
            View All →
          </Link>
        </div>
        
        {recentPredictions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No predictions yet</p>
            <Link
              to="/farmer/predict"
              className="btn-primary"
            >
              Make Your First Prediction
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentPredictions.map((prediction) => (
              <div
                key={prediction.id}
                className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <img
                  src={getImageUrl(prediction.imagePath)}
                  alt="Leaf"
                  className="w-16 h-16 object-cover rounded-lg mr-4"
                />
                <div className="flex-1">
                  <p className="font-semibold">{prediction.predictedDisease}</p>
                  <p className="text-sm text-gray-500">
                    {prediction.growthStage} • {formatDate(prediction.predictionTime)}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  prediction.predictedDisease === 'Healthy Leaf'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {prediction.predictedDisease === 'Healthy Leaf' ? 'Healthy' : 'Disease'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;