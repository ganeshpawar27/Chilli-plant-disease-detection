import React, { useState } from 'react';

const HistoryTable = ({ predictions = [] }) => {
  // Modal state for selected image/prediction details
  const [selectedPrediction, setSelectedPrediction] = useState(null);

  return (
    <div className="relative">
      {/* Existing Table */}
      <table className="w-full text-left border-collapse">
        {/* Table Headings... */}
        <tbody>
          {predictions.map((item, index) => (
            <tr key={item.id || index} className="border-b">
              {/* IMAGE COLUMN */}
              <td className="p-3">
                <img
                  src={item.imageUrl || item.image}
                  alt="Chilli leaf"
                  className="w-12 h-12 rounded object-cover cursor-pointer hover:scale-110 hover:ring-2 hover:ring-emerald-500 transition-all duration-150"
                  onClick={() => setSelectedPrediction(item)}
                  title="Click to view full preview"
                />
              </td>
              {/* Other columns (Disease, Growth Stage, Severity, Date)... */}
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL / CARD OVERLAY */}
      {selectedPrediction && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setSelectedPrediction(null)}
        >
          {/* Pop-up Card Container */}
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 transform transition-all animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800 text-lg">Leaf Image Details</h3>
              <button
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                onClick={() => setSelectedPrediction(null)}
              >
                &times;
              </button>
            </div>

            {/* Full Image */}
            <div className="bg-gray-50 flex items-center justify-center p-4">
              <img
                src={selectedPrediction.imageUrl || selectedPrediction.image}
                alt="Selected chilli leaf preview"
                className="max-h-72 w-auto object-contain rounded-lg shadow-sm"
              />
            </div>

            {/* Disease & Stage Details inside Card */}
            <div className="p-5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Predicted Disease</span>
                <span className="font-bold text-gray-900">{selectedPrediction.disease || selectedPrediction.predictedDisease}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Confidence</span>
                <span className="text-sm font-semibold text-emerald-600">
                  {selectedPrediction.confidence ? `${selectedPrediction.confidence}%` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Growth Stage</span>
                <span className="text-sm text-gray-800">{selectedPrediction.growthStage || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Severity</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                  {selectedPrediction.severity || 'Medium'}
                </span>
              </div>
            </div>

            {/* Action Button */}
            <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-end">
              <button
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
                onClick={() => setSelectedPrediction(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryTable;