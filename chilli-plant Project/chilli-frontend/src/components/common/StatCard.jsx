const StatCard = ({ icon, title, value, color = 'green' }) => {
  const colors = {
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    blue: 'bg-blue-50 text-blue-600',
  };
  
  return (
    <div className="card flex items-center p-6">
      <div className={`p-3 rounded-full ${colors[color]} mr-4`}>
        <span className="text-3xl">{icon}</span>
      </div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;