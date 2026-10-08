import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer
} from 'recharts';
import { DISEASE_COLORS, SEVERITY_COLORS } from '../../utils/constants';

const DiseaseAnalytics = () => {
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
    return <LoadingSpinner message="Loading analytics..." />;
  }
  
  const diseaseData = analytics?.diseaseDistribution?.map(item => ({
    name: item.disease || item[0],
    value: Number(item.count || item[1]),
  })) || [];
  
  const growthData = analytics?.growthStageDistribution?.map(item => ({
    name: item.stage || item[0],
    value: Number(item.count || item[1]),
  })) || [];
  
  const severityData = analytics?.severityDistribution?.map(item => ({
    name: item.severity || item[0],
    value: Number(item.count || item[1]),
  })) || [];
  
  const dailyData = analytics?.dailyPredictions?.map(item => ({
    date: item.date || item[0],
    count: Number(item.count || item[1]),
  })) || [];
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">📈 Disease Analytics</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Disease Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Disease Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={diseaseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {diseaseData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={DISEASE_COLORS[entry.name] || `#${Math.floor(Math.random()*16777215).toString(16)}`} 
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Growth Stage Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Growth Stage Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Severity Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Severity Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {severityData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={SEVERITY_COLORS[entry.name] || '#10b981'} 
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Daily Predictions Trend */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Daily Predictions Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="card bg-gradient-to-r from-green-500 to-green-600 text-white">
          <h4 className="text-lg font-semibold mb-2">Most Common Disease</h4>
          <p className="text-3xl font-bold">{analytics?.mostCommonDisease || 'N/A'}</p>
        </div>
        <div className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <h4 className="text-lg font-semibold mb-2">Total Predictions</h4>
          <p className="text-3xl font-bold">{analytics?.totalPredictions || 0}</p>
        </div>
        <div className="card bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
          <h4 className="text-lg font-semibold mb-2">Today's Predictions</h4>
          <p className="text-3xl font-bold">{analytics?.todayPredictions || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default DiseaseAnalytics;