import { useEffect, useState } from 'react';
import { getCampaigns, createCampaign, deleteCampaign } from '../services/campaignService';
import CampaignForm from '../components/CampaignForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { Plus, Trash2, Play } from 'lucide-react';

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [startingCampaign, setStartingCampaign] = useState(null);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await getCampaigns();
      setCampaigns(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch campaigns');
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleAddCampaign = async (formData) => {
    try {
      setIsSubmitting(true);
      await createCampaign(formData);
      setIsFormOpen(false);
      await fetchCampaigns();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create campaign');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCampaign = async (id) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;

    try {
      setDeleteLoading(id);
      await deleteCampaign(id);
      await fetchCampaigns();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete campaign');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleStartCampaign = async (id) => {
    try {
      setStartingCampaign(id);
      // Assuming start campaign endpoint exists in backend
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/campaigns/start/${id}`, {
        method: 'POST',
      });
      await fetchCampaigns();
    } catch (err) {
      setError('Failed to start campaign');
    } finally {
      setStartingCampaign(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Campaign
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <LoadingSpinner />
        ) : campaigns.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">
            <p>No campaigns yet. Create your first campaign to get started.</p>
          </div>
        ) : (
          campaigns.map((campaign) => (
            <div key={campaign._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                  <p className="text-gray-600 mt-1 text-sm">
                    <span className="font-medium">Subject:</span> {campaign.subject}
                  </p>
                  <p className="text-gray-600 mt-2 text-sm line-clamp-2">
                    <span className="font-medium">Body:</span> {campaign.body}
                  </p>
                  <p className="text-gray-600 mt-2 text-sm">
                    <span className="font-medium">Status:</span>{' '}
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      campaign.status === 'sent' ? 'bg-green-100 text-green-800' :
                      campaign.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {campaign.status || 'draft'}
                    </span>
                  </p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleStartCampaign(campaign._id)}
                    disabled={startingCampaign === campaign._id}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition disabled:opacity-50"
                    title="Start campaign"
                  >
                    {startingCampaign === campaign._id ? (
                      <div className="w-5 h-5 animate-spin border-2 border-green-600 border-t-transparent rounded-full" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteCampaign(campaign._id)}
                    disabled={deleteLoading === campaign._id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                    title="Delete campaign"
                  >
                    {deleteLoading === campaign._id ? (
                      <div className="w-5 h-5 animate-spin border-2 border-red-600 border-t-transparent rounded-full" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <CampaignForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddCampaign}
        isLoading={isSubmitting}
      />
    </div>
  );
}
