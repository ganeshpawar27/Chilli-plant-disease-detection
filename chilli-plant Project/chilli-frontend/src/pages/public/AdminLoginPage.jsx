import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '../../services/authService';
import useAuthStore from '../../store/authStore';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await authService.adminLogin(formData);
      
      if (response.success) {
        setAuth(response.data, response.data.token);
        toast.success('Admin login successful!');
        navigate('/admin/dashboard');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gray-100">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <span className="text-5xl mb-4 inline-block">👨‍💼</span>
          <h2 className="text-3xl font-extrabold text-gray-900">Admin Login</h2>
          <p className="mt-2 text-gray-600">Access the admin dashboard</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter admin username"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-900 transition disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Admin Login'}
            </button>
          </form>
          
          <div className="mt-6 text-center space-y-2">
            <p className="text-gray-600">
              <Link to="/login" className="text-gray-600 hover:text-gray-800 font-semibold">
                ← Back to Farmer Login
              </Link>
            </p>
          </div>
        </div>
        
        <div className="text-center mt-6">
          <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;