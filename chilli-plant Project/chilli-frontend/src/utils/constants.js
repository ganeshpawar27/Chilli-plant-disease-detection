export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
export const UPLOAD_URL = import.meta.env.VITE_UPLOAD_URL || 'http://localhost:8080/uploads';

export const DISEASE_CLASSES = [
  'Bacterial Spot',
  'Cercospora Leaf Spot',
  'Curl Virus',
  'Healthy Leaf',
  'Nutrition Deficiency',
  'White spot',
];

export const GROWTH_CLASSES = [
  'Dry chilli',
  'Flower',
  'Green Chilli',
  'Red Chili',
  'Rotten Chilli',
];

export const SEVERITY_COLORS = {
  'None': '#10b981',
  'Low': '#f59e0b',
  'Medium': '#f97316',
  'High': '#ef4444',
};

export const DISEASE_COLORS = {
  'Bacterial Spot': '#ef4444',
  'Cercospora Leaf Spot': '#f59e0b',
  'Curl Virus': '#8b5cf6',
  'Healthy Leaf': '#10b981',
  'Nutrition Deficiency': '#f97316',
  'White spot': '#06b6d4',
};