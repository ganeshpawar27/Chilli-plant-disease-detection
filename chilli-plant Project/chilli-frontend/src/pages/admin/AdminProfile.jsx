import useAuthStore from '../../store/authStore';
import { 
  ShieldCheckIcon,
  UserCircleIcon,
  KeyIcon 
} from '@heroicons/react/24/outline';

const AdminProfile = () => {
  const { user } = useAuthStore();
  
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">👨‍💼 Admin Profile</h2>
      
      <div className="card bg-gradient-to-r from-gray-700 to-gray-800 text-white mb-6">
        <div className="flex items-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold mr-6">
            A
          </div>
          <div>
            <h3 className="text-2xl font-bold">{user?.username || 'Admin'}</h3>
            <p className="text-gray-300">System Administrator</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="card flex items-center">
          <div className="p-3 bg-gray-100 rounded-lg mr-4">
            <ShieldCheckIcon className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="font-semibold">ROLE_ADMIN</p>
          </div>
        </div>
        
        <div className="card flex items-center">
          <div className="p-3 bg-gray-100 rounded-lg mr-4">
            <UserCircleIcon className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Username</p>
            <p className="font-semibold">{user?.username || 'admin'}</p>
          </div>
        </div>
        
        <div className="card flex items-center">
          <div className="p-3 bg-gray-100 rounded-lg mr-4">
            <KeyIcon className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Account ID</p>
            <p className="font-semibold">{user?.id || '1'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;