import { useEffect, useState } from 'react';
import { getConversations } from '../services/conversationService';
import LoadingSpinner from '../components/LoadingSpinner';
import { RefreshCw, MessageSquare, Send } from 'lucide-react';

export default function Conversations() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(null);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await getConversations();
      setConversations(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch conversations');
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleSyncInbox = async () => {
    try {
      setSyncing(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/conversations/sync`, {
        method: 'POST',
      });
      if (response.ok) {
        await fetchConversations();
      } else {
        setError('Failed to sync inbox');
      }
    } catch (err) {
      setError('Failed to sync inbox');
    } finally {
      setSyncing(false);
    }
  };

  const handleSendReply = async (conversationId) => {
    if (!replyText.trim()) return;

    try {
      setSendingReply(conversationId);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/conversations/send/${conversationId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: replyText }),
        }
      );
      if (response.ok) {
        setReplyText('');
        await fetchConversations();
      } else {
        setError('Failed to send reply');
      }
    } catch (err) {
      setError('Failed to send reply');
    } finally {
      setSendingReply(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Conversations</h1>
        <button
          onClick={handleSyncInbox}
          disabled={syncing}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 mr-2 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing...' : 'Sync Inbox'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-gray-900">Conversations</h2>
          </div>
          {loading ? (
            <LoadingSpinner />
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-600 text-sm">
              No conversations yet
            </div>
          ) : (
            <div className="divide-y max-h-96 overflow-y-auto">
              {conversations.map((conv) => (
                <button
                  key={conv._id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition ${
                    selectedConversation?._id === conv._id ? 'bg-blue-50' : ''
                  }`}
                >
                  <p className="font-medium text-gray-900 text-sm truncate">{conv.sender}</p>
                  <p className="text-gray-600 text-xs truncate">{conv.subject}</p>
                  <div className={`text-xs mt-1 ${
                    conv.status === 'unread' ? 'text-blue-600 font-semibold' : 'text-gray-500'
                  }`}>
                    {conv.status}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden flex flex-col">
          {selectedConversation ? (
            <>
              <div className="p-6 border-b">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600">From</p>
                    <p className="font-semibold text-gray-900">{selectedConversation.sender}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    selectedConversation.status === 'unread' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedConversation.status}
                  </span>
                </div>
                <p className="text-gray-900 font-medium mt-4">{selectedConversation.subject}</p>
              </div>

              <div className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700">{selectedConversation.message}</p>
                  </div>

                  {selectedConversation.ai_reply && (
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <p className="text-xs font-semibold text-blue-900 mb-2">AI Generated Reply:</p>
                      <p className="text-sm text-blue-900">{selectedConversation.ai_reply}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => handleSendReply(selectedConversation._id)}
                    disabled={sendingReply === selectedConversation._id || !replyText.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {sendingReply === selectedConversation._id ? (
                      <div className="w-5 h-5 animate-spin border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-600">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p>Select a conversation to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
