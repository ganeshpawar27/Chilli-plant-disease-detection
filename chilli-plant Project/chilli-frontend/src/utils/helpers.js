import { format } from 'date-fns';

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), 'dd MMM yyyy, hh:mm a');
  } catch (error) {
    return dateString;
  }
};

export const formatConfidence = (confidence) => {
  if (confidence === null || confidence === undefined) return 'N/A';
  return `${confidence.toFixed(2)}%`;
};

export const getSeverityColor = (severity) => {
  const colors = {
    'None': 'bg-green-100 text-green-800',
    'Low': 'bg-yellow-100 text-yellow-800',
    'Medium': 'bg-orange-100 text-orange-800',
    'High': 'bg-red-100 text-red-800',
  };
  return colors[severity] || 'bg-gray-100 text-gray-800';
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder-image.png';
  if (imagePath.startsWith('http')) return imagePath;
  return `/uploads/${imagePath}`;
};