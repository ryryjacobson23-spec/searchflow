import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import KanbanBoard from './components/KanbanBoard';
import DealDetailPanel from './components/DealDetailPanel';
import AddDealModal from './components/AddDealModal';
import { STAGES } from './constants';
import { formatCurrency } from './utils';
import * as api from './api';
import { Plus, RefreshCw } from 'lucide-react';

export default function App() {
  const [deals, setDeals] = useState([]);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDeals = async () => {
    try {
      setError(null);
      const data = await api.getDeals();
      setDeals(data);
    } catch (err) {
      setError('Failed to load deals. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeals();
  }, []);

  const handleDealMove = async (dealId, newStage) => {
    // Optimistic update
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, stage: newStage } : d));
    if (selectedDeal?.id === dealId) {
      setSelectedDeal(prev => ({ ...prev, stage: newStage }));
    }
    try {
      await api.updateDeal(dealId, { stage: newStage });
    } catch {
      // Revert on failure
      loadDeals();
    }
  };

  const handleDealUpdate = async (dealId, updates) => {
    const updated = await api.updateDeal(dealId, updates);
    setDeals(prev => prev.map(d => d.id === dealId ? updated : d));
    setSelectedDeal(updated);
    return updated;
  };

  const handleDealCreate = async (dealData) => {
    const newDeal = await api.createDeal(dealData);
    setDeals(prev => [...prev, newDeal]);
    setIsAddModalOpen(false);
  };

  const handleDealDelete = async (dealId) => {
    await api.deleteDeal(dealId);
    setDeals(prev => prev.filter(d => d.id !== dealId));
    setSelectedDeal(null);
  };

  const handleNoteAdd = async (dealId, content) => {
    const updated = await api.addNote(dealId, content);
    setDeals(prev => prev.map(d => d.id === dealId ? updated : d));
    setSelectedDeal(updated);
  };

  const handleNoteDelete = async (dealId, noteId) => {
    const updated = await api.deleteNote(dealId, noteId);
    setDeals(prev => prev.map(d => d.id === dealId ? updated : d));
    setSelectedDeal(updated);
  };

  const handleCardClick = (deal) => {
    setSelectedDeal(deal);
  };

  // Summary stats
  const activeDeals = deals.filter(d => d.stage !== 'Closed');
  const closedDeals = deals.filter(d => d.stage === 'Closed');
  const totalPipelineValue = activeDeals.reduce((sum, d) => sum + (d.askingPrice || 0), 0);
  const totalClosedValue = closedDeals.reduce((sum, d) => sum + (d.askingPrice || 0), 0);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar
        dealCount={deals.length}
        pipelineValue={totalPipelineValue}
        closedCount={closedDeals.length}
        onAddDeal={() => setIsAddModalOpen(true)}
      />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Deal Pipeline</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {deals.length} deals · {STAGES.length} stages
            </p>
          </div>

          <div className="flex items-center gap-6">
            {/* Key metrics */}
            <div className="hidden lg:flex items-center gap-6">
              <div className="text-right">
                <div className="text-lg font-bold text-slate-900">{formatCurrency(totalPipelineValue)}</div>
                <div className="text-xs text-slate-500">Active Pipeline</div>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div className="text-right">
                <div className="text-lg font-bold text-emerald-600">{formatCurrency(totalClosedValue)}</div>
                <div className="text-xs text-slate-500">Total Closed</div>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div className="text-right">
                <div className="text-lg font-bold text-slate-900">{activeDeals.length}</div>
                <div className="text-xs text-slate-500">Active Deals</div>
              </div>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm"
            >
              <Plus size={16} />
              Add Deal
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6 scrollbar-thin">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3 text-slate-400">
                <RefreshCw size={32} className="animate-spin" />
                <span className="text-sm">Loading pipeline...</span>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-4 text-center max-w-sm">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-500 text-xl">!</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{error}</p>
                  <p className="text-sm text-slate-500 mt-1">Make sure the backend server is running on port 3001.</p>
                </div>
                <button
                  onClick={loadDeals}
                  className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <KanbanBoard
              deals={deals}
              stages={STAGES}
              onDealMove={handleDealMove}
              onDealClick={handleCardClick}
            />
          )}
        </main>
      </div>

      {/* Detail panel */}
      {selectedDeal && (
        <DealDetailPanel
          deal={selectedDeal}
          stages={STAGES}
          onClose={() => setSelectedDeal(null)}
          onUpdate={handleDealUpdate}
          onDelete={handleDealDelete}
          onNoteAdd={handleNoteAdd}
          onNoteDelete={handleNoteDelete}
        />
      )}

      {/* Add deal modal */}
      {isAddModalOpen && (
        <AddDealModal
          stages={STAGES}
          onClose={() => setIsAddModalOpen(false)}
          onCreate={handleDealCreate}
        />
      )}
    </div>
  );
}
