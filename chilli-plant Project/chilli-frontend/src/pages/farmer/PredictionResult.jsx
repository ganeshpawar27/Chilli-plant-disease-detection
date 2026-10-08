import { useLocation, Link } from 'react-router-dom';
import { getImageUrl } from '../../utils/helpers';

const PredictionResult = () => {
  const location = useLocation();
  const result = location.state?.result;
  const imagePreview = location.state?.imagePreview;
  
  if (!result) {
    return (
      <div className="text-center py-12">
        <p className="text-5xl mb-4">🔍</p>
        <h3 className="text-xl font-semibold mb-2">No Result Found</h3>
        <p className="text-gray-500 mb-6">Please make a prediction first</p>
        <Link to="/farmer/predict" className="btn-primary">
          Go to Prediction
        </Link>
      </div>
    );
  }
  
  const { disease, growth, treatment } = result;
  
  const getSeverityColor = (severity) => {
    const colors = {
      'None': 'bg-green-100 text-green-800',
      'Low': 'bg-yellow-100 text-yellow-800',
      'Medium': 'bg-orange-100 text-orange-800',
      'High': 'bg-red-100 text-red-800',
    };
    return colors[severity] || 'bg-gray-100 text-gray-800';
  };
  
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">🔬 Prediction Results</h2>
      
      {/* Image and Basic Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Uploaded Image</h3>
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Uploaded leaf"
              className="w-full h-48 object-cover rounded-lg"
            />
          ) : (
            <img
              src={getImageUrl(result.imagePath)}
              alt="Uploaded leaf"
              className="w-full h-48 object-cover rounded-lg"
            />
          )}
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">🦠 Disease Detection</h3>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-800 mb-2">
              {disease.class}
            </p>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(disease.severity)}`}>
              {disease.severity} Severity
            </span>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Confidence</span>
                <span>{disease.confidence.toFixed(2)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${disease.confidence}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">🌱 Growth Stage</h3>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-800 mb-2">
              {growth.class}
            </p>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Confidence</span>
                <span>{growth.confidence.toFixed(2)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${growth.confidence}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Treatment Recommendations */}
      {treatment && (
        <div className="card mb-6">
          <h3 className="text-xl font-bold mb-6">💊 Treatment Recommendations</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">📝 Description</h4>
                <p className="text-gray-600">{treatment.description}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">🔍 Cause</h4>
                <p className="text-gray-600">{treatment.cause}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">⚠️ Symptoms</h4>
                <p className="text-gray-600">{treatment.symptoms}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">🧪 Chemical Treatment</h4>
                <p className="text-red-700">{treatment.pesticide}</p>
              </div>
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">🌿 Organic Treatment</h4>
                <p className="text-green-700">{treatment.organic}</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">🛡️ Prevention Tips</h4>
                <p className="text-blue-700">{treatment.prevention}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Actions */}
      <div className="flex justify-center space-x-4">
        <Link to="/farmer/predict" className="btn-secondary">
          🔄 Analyze Another
        </Link>
        <Link to="/farmer/history" className="btn-primary">
          📊 View History
        </Link>
      </div>
    </div>
  );
};

export default PredictionResult;