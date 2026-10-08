import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatCard from '../../components/common/StatCard';
import { formatDate } from '../../utils/helpers';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchAnalytics();
  }, []);
  
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">📊 Admin Dashboard</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon="👥"
          title="Total Farmers"
          value={analytics?.totalFarmers || 0}
          color="blue"
        />
        <StatCard
          icon="🔬"
          title="Total Predictions"
          value={analytics?.totalPredictions || 0}
          color="green"
        />
        <StatCard
          icon="📅"
          title="Today's Predictions"
          value={analytics?.todayPredictions || 0}
          color="yellow"
        />
        <StatCard
          icon="🦠"
          title="Most Common Disease"
          value={analytics?.mostCommonDisease || 'N/A'}
          color="red"
        />
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/admin/farmers" className="card hover:shadow-lg transition">
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg mr-4">
              <span className="text-3xl">👥</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Manage Farmers</h3>
              <p className="text-gray-500 text-sm">View and manage farmer accounts</p>
            </div>
          </div>
        </Link>
        
        <Link to="/admin/analytics" className="card hover:shadow-lg transition">
          <div className="flex items-center">
            <div className="p-3 bg-green-50 rounded-lg mr-4">
              <span className="text-3xl">📈</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">View Analytics</h3>
              <p className="text-gray-500 text-sm">Detailed disease and growth analytics</p>
            </div>
          </div>
        </Link>
      </div>
      
      {/* Recent Activity */}
      {analytics?.dailyPredictions && analytics.dailyPredictions.length > 0 && (
        <div className="card mt-6">
          <h3 className="text-lg font-semibold mb-4">Recent Prediction Activity</h3>
          <div className="space-y-3">
            {analytics.dailyPredictions.slice(-5).reverse().map((day, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{formatDate(day.date)}</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {day.count} predictions
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;