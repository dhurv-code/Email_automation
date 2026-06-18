import { TrendingUp } from 'lucide-react';

export default function StatsCard({ title, value, change, icon: Icon }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change !== undefined && (
            <div className="flex items-center mt-2 text-green-600 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>{change}% increase</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
        )}
      </div>
    </div>
  );
}
