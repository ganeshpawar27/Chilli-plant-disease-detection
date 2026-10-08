import { useEffect, useState } from 'react';
import { farmerService } from '../../services/farmerService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate, getImageUrl, getSeverityColor } from '../../utils/helpers';
import { Link } from 'react-router-dom';

const PredictionHistory = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    fetchHistory();
  }, [page]);
  
  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await farmerService.getHistory(page, 10);
      
      if (Array.isArray(response)) {
        setPredictions(response);
        setTotalPages(1);
      } else {
        setPredictions(response.content || []);
        setTotalPages(response.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredPredictions = filter === 'all'
    ? predictions
    : predictions.filter(p => 
        filter === 'healthy' 
          ? p.predictedDisease === 'Healthy Leaf'
          : p.predictedDisease !== 'Healthy Leaf'
      );
  
  if (loading) {
    return <LoadingSpinner message="Loading prediction history..." />;
  }
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">📊 Prediction History</h2>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'all'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('healthy')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'healthy'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Healthy
          </button>
          <button
            onClick={() => setFilter('disease')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'disease'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Diseases
          </button>
        </div>
      </div>
      
      {filteredPredictions.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-gray-500 mb-4">No predictions found</p>
          <Link to="/farmer/predict" className="btn-primary">
            Make Your First Prediction
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Disease
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Growth Stage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPredictions.map((prediction) => (
                  <tr key={prediction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={getImageUrl(prediction.imagePath)}
                        alt="Leaf"
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium">{prediction.predictedDisease}</span>
                      <p className="text-xs text-gray-500">
                        {prediction.confidence?.toFixed(2)}% confidence
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {prediction.growthStage}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(prediction.severity)}`}>
                        {prediction.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(prediction.predictionTime)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 flex items-center justify-between border-t">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="btn-secondary disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page === totalPages - 1}
                className="btn-secondary disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PredictionHistory;