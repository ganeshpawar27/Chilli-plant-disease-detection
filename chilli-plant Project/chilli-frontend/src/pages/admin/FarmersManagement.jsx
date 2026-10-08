import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate } from '../../utils/helpers';
import { toast } from 'react-hot-toast';
import { 
  TrashIcon, 
  MagnifyingGlassIcon,  // ✅ Correct name
  ChevronLeftIcon,
  ChevronRightIcon 
} from '@heroicons/react/24/outline';
const FarmersManagement = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  useEffect(() => {
    fetchFarmers();
  }, [page]);
  
  const fetchFarmers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getFarmers(page, 10);
      setFarmers(response.content || response);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error('Error fetching farmers:', error);
      toast.error('Failed to load farmers');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (farmerId) => {
    try {
      const response = await adminService.deleteFarmer(farmerId);
      
      if (response.success) {
        toast.success('Farmer deleted successfully');
        fetchFarmers();
      } else {
        toast.error(response.message || 'Failed to delete farmer');
      }
    } catch (error) {
      console.error('Error deleting farmer:', error);
      toast.error('Failed to delete farmer');
    } finally {
      setDeleteConfirm(null);
    }
  };
  
  const filteredFarmers = farmers.filter(farmer => 
    farmer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.village?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (loading) {
    return <LoadingSpinner message="Loading farmers..." />;
  }
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">👥 Farmers Management</h2>
        
        <div className="relative">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search farmers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>
      
      {filteredFarmers.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-5xl mb-4">👥</p>
          <p className="text-gray-500">No farmers found</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Farmer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Village
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Predictions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFarmers.map((farmer) => (
                  <tr key={farmer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-700">
                          {farmer.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="ml-3">
                          <p className="font-medium">{farmer.name}</p>
                          <p className="text-xs text-gray-500">ID: {farmer.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm">{farmer.email}</p>
                      <p className="text-xs text-gray-500">{farmer.phone}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {farmer.village}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {farmer.totalPredictions || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(farmer.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setDeleteConfirm(farmer.id)}
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 flex items-center justify-between border-t">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="btn-secondary disabled:opacity-50 flex items-center"
              >
                <ChevronLeftIcon className="w-4 h-4 mr-1" />
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page === totalPages - 1}
                className="btn-secondary disabled:opacity-50 flex items-center"
              >
                Next
                <ChevronRightIcon className="w-4 h-4 ml-1" />
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Delete Farmer?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this farmer? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="btn-danger"
              >
                Delete Farmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmersManagement;