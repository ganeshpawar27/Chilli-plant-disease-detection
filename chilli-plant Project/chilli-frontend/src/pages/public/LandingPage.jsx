import { Link } from 'react-router-dom';
import { 
  CameraIcon, 
  ShieldCheckIcon, 
  ChartBarIcon, 
  SparklesIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';

const LandingPage = () => {
  const features = [
    {
      icon: CameraIcon,
      title: 'Instant Diagnosis',
      description: 'Upload a photo of your chili leaf and get AI-powered disease detection in seconds',
      color: 'bg-green-50 text-green-600',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Treatment Guide',
      description: 'Get chemical and organic treatment recommendations for every detected disease',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: ChartBarIcon,
      title: 'Growth Monitoring',
      description: 'Track chili growth stages from flower to ripe red chili with AI analysis',
      color: 'bg-yellow-50 text-yellow-600',
    },
    {
      icon: SparklesIcon,
      title: 'Smart Analytics',
      description: 'View prediction history and disease trends for better crop management',
      color: 'bg-purple-50 text-purple-600',
    },
  ];
  
  const stats = [
    { value: '6+', label: 'Disease Types' },
    { value: '5', label: 'Growth Stages' },
    { value: '98%', label: 'Accuracy' },
    { value: '24/7', label: 'Available' },
  ];
  
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="animate-bounce inline-block text-6xl mb-6">🌶️</div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-green-900 mb-6">
            Smart Chili Disease
            <span className="block text-green-600 mt-2">Detection System</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Advanced AI-powered solution for detecting chili plant diseases and monitoring growth stages
            with treatment recommendations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-xl hover:bg-green-700 transition shadow-lg hover:shadow-xl"
            >
              Get Started Free
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-600 text-lg font-semibold rounded-xl hover:bg-gray-50 transition shadow-lg"
            >
              Login to Dashboard
            </Link>
          </div>
          {/* In the hero section, after the existing buttons */}
<div className="mt-6 text-center">
  <Link
    to="/admin/login"
    className="text-green-600 hover:text-green-700 text-sm font-medium"
  >
    👨‍💼 Admin Login →
  </Link>
</div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="bg-green-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-green-300 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose ChiliAI?
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need for healthy chili cultivation
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition border border-gray-100 hover:border-green-200"
                >
                  <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Protect Your Crops?
          </h2>
          <p className="text-green-100 mb-8 text-lg">
            Join thousands of farmers using AI for better crop management
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-8 py-4 bg-white text-green-700 text-lg font-semibold rounded-xl hover:bg-gray-100 transition"
          >
            Create Free Account
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;