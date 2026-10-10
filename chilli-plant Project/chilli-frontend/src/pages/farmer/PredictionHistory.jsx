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
  const [selected, setSelected] = useState(null); // prediction opened in the card

  useEffect(() => {
    fetchHistory();
  }, [page]);

  // Close the card with the Escape key and lock page scroll while it is open
  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setSelected(null);
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [selected]);

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
                      <button
                        type="button"
                        onClick={() => setSelected(prediction)}
                        title="Click to view details"
                        className="block rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <img
                          src={getImageUrl(prediction.imagePath)}
                          alt="Leaf"
                          className="w-12 h-12 object-cover rounded-lg cursor-pointer hover:opacity-80 hover:ring-2 hover:ring-green-500 transition"
                        />
                      </button>
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

      {selected && (
        <PredictionDetailModal
          prediction={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
};

// Popup card with full details of one past prediction
const PredictionDetailModal = ({ prediction, onClose }) => {
  const p = prediction;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white rounded-t-2xl">
          <div>
            <h3 className="text-xl font-bold">🔬 Prediction Details</h3>
            <p className="text-sm text-gray-500">{formatDate(p.predictionTime)}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Image + results */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <img
                src={getImageUrl(p.imagePath)}
                alt="Uploaded leaf"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm font-semibold text-gray-500 mb-2">🦠 Disease</p>
              <p className="text-2xl font-bold text-green-800 mb-2">
                {p.predictedDisease || 'N/A'}
              </p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(p.severity)}`}>
                {p.severity || 'N/A'} Severity
              </span>
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span>Confidence</span>
                  <span>{p.confidence?.toFixed(2)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${p.confidence || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm font-semibold text-gray-500 mb-2">🌱 Growth Stage</p>
              <p className="text-2xl font-bold text-blue-800 mb-2">
                {p.growthStage || 'N/A'}
              </p>
              <div className="mt-[3.25rem]">
                <div className="flex justify-between text-xs mb-1">
                  <span>Confidence</span>
                  <span>{p.growthConfidence?.toFixed(2)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${p.growthConfidence || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Treatment recommendations */}
          <div>
            <h4 className="text-lg font-bold mb-4">💊 Treatment Recommendations</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-gray-700 mb-2">📝 Description</h5>
                  <p className="text-gray-600 text-sm">{p.description || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-gray-700 mb-2">🔍 Cause</h5>
                  <p className="text-gray-600 text-sm">{p.cause || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-gray-700 mb-2">⚠️ Symptoms</h5>
                  <p className="text-gray-600 text-sm">{p.symptoms || 'N/A'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <h5 className="font-semibold text-red-800 mb-2">🧪 Chemical Treatment</h5>
                  <p className="text-red-700 text-sm">{p.pesticide || 'N/A'}</p>
                </div>
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h5 className="font-semibold text-green-800 mb-2">🌿 Organic Treatment</h5>
                  <p className="text-green-700 text-sm">{p.organicTreatment || 'N/A'}</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <h5 className="font-semibold text-blue-800 mb-2">🛡️ Prevention Tips</h5>
                  <p className="text-blue-700 text-sm">{p.prevention || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end">
          <button type="button" onClick={onClose} className="btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PredictionHistory;
