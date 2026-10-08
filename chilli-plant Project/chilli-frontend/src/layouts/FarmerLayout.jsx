import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { HomeIcon, CameraIcon, ClockIcon, UserIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

const FarmerLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const navItems = [
    { to: '/farmer/dashboard', label: 'Dashboard', icon: HomeIcon },
    { to: '/farmer/predict', label: 'Predict Disease', icon: CameraIcon },
    { to: '/farmer/history', label: 'History', icon: ClockIcon },
    { to: '/farmer/profile', label: 'Profile', icon: UserIcon },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-green-800 to-green-900 text-white fixed h-full flex flex-col">
        <div className="p-6 border-b border-green-700">
          <h1 className="text-2xl font-bold flex items-center">
            <span className="mr-2">🌶️</span> ChiliAI
          </h1>
          <p className="text-sm text-green-200 mt-1">Farmer Portal</p>
        </div>
        
        <div className="p-4 m-4 bg-green-700/50 rounded-lg">
          <p className="font-semibold truncate">{user?.name || 'Farmer'}</p>
          <p className="text-xs text-green-200 truncate">{user?.village || 'Village'}</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex items-center px-4 py-3 rounded-lg transition group ${
                  isActive
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'text-green-100 hover:bg-green-700/50'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-2 h-2 bg-white rounded-full"></span>
                )}
              </NavLink>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-green-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 rounded-lg text-red-200 hover:bg-red-600/50 transition font-medium"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Top Bar */}
        <div className="bg-white shadow-sm px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {navItems.find(item => item.to === location.pathname)?.label || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">{user?.name}</p>
              <p className="text-xs text-gray-500">Farmer</p>
            </div>
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'F'}
            </div>
          </div>
        </div>
        
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default FarmerLayout;