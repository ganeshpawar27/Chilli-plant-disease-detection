import { Outlet, Link } from 'react-router-dom';
import React from 'react';
const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      <Link to="/" className="flex items-center space-x-2">
        <span className="text-2xl">🌶️</span>
        <span className="text-xl font-bold text-green-800">ChiliAI</span>
      </Link>
      <div className="flex items-center space-x-4">
        <Link
          to="/admin/login"
          className="text-gray-500 hover:text-gray-700 font-medium text-sm"
        >
          Admin
        </Link>
        <Link
          to="/login"
          className="text-gray-600 hover:text-green-600 font-medium"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium"
        >
          Get Started
        </Link>
      </div>
    </div>
  </div>
</nav>
      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-green-800 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">🌶️ ChiliAI</h3>
              <p className="text-green-200 text-sm">
                Smart Chili Plant Disease Detection System using AI and Machine Learning
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-green-200">
                <li><Link to="/" className="hover:text-white">Home</Link></li>
                <li><Link to="/login" className="hover:text-white">Login</Link></li>
                <li><Link to="/register" className="hover:text-white">Register</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-green-200">
                <li>✓ Disease Detection</li>
                <li>✓ Growth Stage Analysis</li>
                <li>✓ Treatment Recommendations</li>
                <li>✓ Prediction History</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-green-700 mt-8 pt-6 text-center text-sm text-green-300">
            <p>© 2024 ChiliAI - Final Year Project. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;