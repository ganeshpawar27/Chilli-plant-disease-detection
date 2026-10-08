import { useState, useRef } from 'react';

const ImageUploader = ({ onImageSelect }) => {
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  
  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };
  
  return (
    <div
      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
        dragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400'
      }`}
      onClick={() => inputRef.current?.click()}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) handleFileSelect(file);
        }}
      />
      
      {preview ? (
        <div className="flex flex-col items-center">
          <img
            src={preview}
            alt="Preview"
            className="max-h-64 rounded-lg shadow-md"
          />
          <p className="mt-4 text-sm text-gray-500">Click to change image</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <svg
            className="w-16 h-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="mt-4 text-gray-600 font-medium">
            Drag & drop your chili leaf image here
          </p>
          <p className="mt-2 text-sm text-gray-400">
            or click to browse from your device
          </p>
          <p className="mt-4 text-xs text-gray-400">
            Supported formats: JPG, PNG, WEBP (Max 10MB)
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;