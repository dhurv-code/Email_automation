import { useEffect, useState } from 'react';
import { getLeads, createLead, deleteLead } from '../services/leadService';
import LeadForm from '../components/LeadForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { Plus, Trash2 } from 'lucide-react';

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await getLeads();
      setLeads(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch leads');
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleAddLead = async (formData) => {
    try {
      setIsSubmitting(true);
      await createLead(formData);
      setIsFormOpen(false);
      await fetchLeads();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLead = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;

    try {
      setDeleteLoading(id);
      await deleteLead(id);
      await fetchLeads();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete lead');
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Lead
        </button>
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
        ) : leads.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            <p>No leads yet. Create your first lead to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Company</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-900">{lead.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{lead.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{lead.company || '-'}</td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleDeleteLead(lead._id)}
                        disabled={deleteLoading === lead._id}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50 transition"
                      >
                        {deleteLoading === lead._id ? (
                          <span className="text-xs">Deleting...</span>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <LeadForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddLead}
        isLoading={isSubmitting}
      />
    </div>
  );
}
