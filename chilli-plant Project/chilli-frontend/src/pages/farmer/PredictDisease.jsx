import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { farmerService } from '../../services/farmerService';
import ImageUploader from '../../components/common/ImageUploader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';

const PredictDisease = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  const handleImageSelect = (file) => {
    setSelectedImage(file);
    setResult(null);
    
    // Create preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(URL.createObjectURL(file));
  };
  
  const handlePredict = async () => {
    if (!selectedImage) {
      toast.error('Please select an image first');
      return;
    }
    
    console.log('🔍 Starting prediction...');
    console.log('📸 Image:', selectedImage.name, selectedImage.size, 'bytes');
    
    setLoading(true);
    
    try {
      const response = await farmerService.predictDisease(selectedImage);
      console.log('✅ Full response:', response);
      
      if (response && response.success) {
        console.log('🎉 Setting result:', response.data);
        setResult(response.data);
        toast.success('Prediction completed!');
      } else {
        console.error('❌ Prediction failed:', response);
        toast.error(response?.message || 'Prediction failed');
      }
    } catch (error) {
      console.error('💥 Error:', error);
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      
      toast.error(error.response?.data?.message || 'Prediction failed. Please try again.');
    } finally {
      console.log('🏁 Finally block: Setting loading to false');
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div>
        <LoadingSpinner message="Analyzing your chili leaf image..." />
        <p className="text-center text-gray-500 mt-4">
          This may take a few seconds...
        </p>
      </div>
    );
  }
  
  if (result) {
    return (
      <PredictionResultView 
        result={result} 
        imageUrl={previewUrl}
        onReset={() => {
          setResult(null);
          setSelectedImage(null);
          setPreviewUrl(null);
        }}
      />
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">🌿 Disease Prediction</h2>
      
      <div className="card mb-6">
        <h3 className="text-lg font-semibold mb-4">Upload Leaf Image</h3>
        <ImageUploader onImageSelect={handleImageSelect} />
        
        <div className="mt-6 flex justify-center">
          <button
            onClick={handlePredict}
            disabled={!selectedImage}
            className="btn-primary px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🔍 Analyze Image
          </button>
        </div>
      </div>
    </div>
  );
};

// Prediction Result Component
const PredictionResultView = ({ result, imageUrl, onReset }) => {
  const { disease, growth, treatment, predictionId, imagePath } = result;
  
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Uploaded Image</h3>
          <img
            src={imageUrl || `/uploads/${imagePath}`}
            alt="Uploaded leaf"
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">🦠 Disease Detection</h3>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-800 mb-2">
              {disease?.class || 'N/A'}
            </p>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(disease?.severity)}`}>
              {disease?.severity || 'N/A'} Severity
            </span>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Confidence</span>
                <span>{disease?.confidence?.toFixed(2)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${disease?.confidence || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">🌱 Growth Stage</h3>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-800 mb-2">
              {growth?.class || 'N/A'}
            </p>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Confidence</span>
                <span>{growth?.confidence?.toFixed(2)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${growth?.confidence || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
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
      
      <div className="flex justify-center space-x-4">
        <button onClick={onReset} className="btn-secondary">
          🔄 Analyze Another
        </button>
        <Link to="/farmer/history" className="btn-primary">
          📊 View History
        </Link>
      </div>
    </div>
  );
};

export default PredictDisease;