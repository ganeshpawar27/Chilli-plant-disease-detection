const SuccessAlert = ({ message, onClose }) => {
  if (!message) return null;
  
  return (
    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg relative mb-4">
      <span className="block sm:inline">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-0 bottom-0 right-0 px-4 py-3"
        >
          <span className="text-green-500">×</span>
        </button>
      )}
    </div>
  );
};

export default SuccessAlert;