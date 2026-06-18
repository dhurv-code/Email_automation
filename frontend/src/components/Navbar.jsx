import { User, LogOut } from 'lucide-react';

export default function Navbar() {
  return (
    <div className="bg-white shadow">
      <div className="px-6 py-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Email Automation Platform</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-gray-700">
            <User className="w-5 h-5" />
            <span>Admin</span>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
            <LogOut className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
