import { useEffect, useState } from 'react';
import { getEmailLogs } from '../services/emailLogService';
import LoadingSpinner from '../components/LoadingSpinner';
import { Mail } from 'lucide-react';

export default function EmailLogs() {
  const [emailLogs, setEmailLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmailLogs = async () => {
      try {
        setLoading(true);
        const response = await getEmailLogs();
        setEmailLogs(response.data || []);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch email logs');
        setEmailLogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmailLogs();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'bounced':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Email Logs</h1>
        <div className="text-gray-600 text-sm">
          {emailLogs.length} emails logged
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : emailLogs.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            <Mail className="w-12 h-12 mx-auto text-gray-400 mb-2" />
            <p>No email logs yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Recipient</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Subject</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Campaign</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Sent Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Opened</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {emailLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-900">{log.recipient_email || log.recipient}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{log.subject}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(log.status)}`}>
                        {log.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{log.campaign_name || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(log.sent_date)}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        log.opened ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {log.opened ? 'Yes' : 'No'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
