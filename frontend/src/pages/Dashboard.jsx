import { useEffect, useState } from 'react';
import { getDashboardStats } from '../services/dashboardService';
import StatsCard from '../components/StatsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Mail, Users, Send, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await getDashboardStats();
        setStats(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard stats');
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p className="font-medium">Error</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  const defaultStats = {
    total_leads: 0,
    campaigns_sent: 0,
    emails_sent: 0,
    conversations: 0,
  };

  const data = stats || defaultStats;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back to your email automation platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Leads"
          value={data.total_leads}
          change={12}
          icon={Users}
        />
        <StatsCard
          title="Campaigns Sent"
          value={data.campaigns_sent}
          change={8}
          icon={Send}
        />
        <StatsCard
          title="Emails Sent"
          value={data.emails_sent}
          change={15}
          icon={Mail}
        />
        <StatsCard
          title="Conversations"
          value={data.conversations}
          change={5}
          icon={CheckCircle}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <p className="text-gray-600 text-center py-8">No recent activity yet</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Avg. Campaign Size</span>
              <span className="font-semibold text-gray-900">-</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Avg. Response Rate</span>
              <span className="font-semibold text-gray-900">-</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Emails Sent</span>
              <span className="font-semibold text-gray-900">{data.emails_sent}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
