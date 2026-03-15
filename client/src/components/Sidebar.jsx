import { LayoutDashboard, TrendingUp, Settings, ChevronRight, Briefcase } from 'lucide-react';
import { formatCurrency } from '../utils';

const NAV_ITEMS = [
  { id: 'pipeline',   icon: LayoutDashboard, label: 'Pipeline' },
  { id: 'analytics',  icon: TrendingUp,      label: 'Analytics' },
  { id: 'settings',   icon: Settings,        label: 'Settings', soon: true },
];

export default function Sidebar({ dealCount, pipelineValue, closedCount, onAddDeal, currentPage, onNavigate }) {
  return (
    <aside className="w-60 flex-shrink-0 bg-slate-900 flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Briefcase size={16} className="text-white" />
          </div>
          <div>
            <span className="text-white font-bold text-base tracking-tight">SearchFlow</span>
            <div className="text-slate-500 text-xs">Deal Pipeline</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ id, icon: Icon, label, soon }) => {
          const active = currentPage === id;
          return (
            <button
              key={id}
              onClick={() => !soon && onNavigate(id)}
              disabled={soon}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group ${
                active
                  ? 'bg-slate-800 text-white'
                  : soon
                  ? 'text-slate-600 cursor-default'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  size={16}
                  className={
                    active ? 'text-blue-400'
                    : soon  ? 'text-slate-600'
                    : 'text-slate-500 group-hover:text-slate-400'
                  }
                />
                {label}
              </div>
              {soon && (
                <span className="text-[10px] font-medium bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded">
                  Soon
                </span>
              )}
              {active && <ChevronRight size={14} className="text-slate-600" />}
            </button>
          );
        })}
      </nav>

      {/* Stats */}
      <div className="px-3 pb-4 space-y-2">
        <div className="bg-slate-800/60 rounded-xl p-4 space-y-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pipeline Summary</p>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Total Deals</span>
              <span className="text-white font-semibold text-sm">{dealCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Active Value</span>
              <span className="text-white font-semibold text-sm">{formatCurrency(pipelineValue)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Closed</span>
              <span className="text-emerald-400 font-semibold text-sm">{closedCount}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onAddDeal}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <span className="text-lg leading-none">+</span>
          New Deal
        </button>
      </div>
    </aside>
  );
}
