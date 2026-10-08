import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { 
  ChartBarIcon, 
  UsersIcon, 
  PresentationChartLineIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';

const AdminLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: ChartBarIcon },
    { to: '/admin/farmers', label: 'Farmers', icon: UsersIcon },
    { to: '/admin/analytics', label: 'Analytics', icon: PresentationChartLineIcon },
    { to: '/admin/profile', label: 'Profile', icon: UserCircleIcon },
  ];
  
  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white fixed h-full flex flex-col border-r border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold flex items-center">
            <span className="mr-2">🌶️</span> ChiliAI
          </h1>
          <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
        </div>
        
        <div className="p-4 m-4 bg-gray-700/50 rounded-lg">
          <p className="font-semibold truncate">{user?.username || 'Admin'}</p>
          <p className="text-xs text-gray-400">Administrator</p>
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
                    ? 'bg-gray-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700'
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
        
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 rounded-lg text-red-400 hover:bg-red-600/50 hover:text-white transition font-medium"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 ml-64 bg-gray-50 min-h-screen">
        {/* Top Bar */}
        <div className="bg-white shadow-sm px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {navItems.find(item => item.to === location.pathname)?.label || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">{user?.username}</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold">
              A
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

export default AdminLayout;