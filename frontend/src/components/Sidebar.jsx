import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Mail, MessageCircle, FileText } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/leads', label: 'Leads', icon: Users },
    { path: '/campaigns', label: 'Campaigns', icon: Mail },
    { path: '/conversations', label: 'Conversations', icon: MessageCircle },
    { path: '/email-logs', label: 'Email Logs', icon: FileText },
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-gray-900">Email Pro</h1>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 border-l-4 transition ${
                isActive
                  ? 'bg-blue-50 border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
