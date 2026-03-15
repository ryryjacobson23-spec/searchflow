import { useDroppable } from '@dnd-kit/core';
import DealCard from './DealCard';
import { STAGE_CONFIG } from '../constants';
import { formatCurrency } from '../utils';

export default function KanbanColumn({ stage, deals, onDealClick, isDraggingId }) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  const config = STAGE_CONFIG[stage] || STAGE_CONFIG['Sourced'];

  const totalValue = deals.reduce((sum, d) => sum + (d.askingPrice || 0), 0);

  return (
    <div className="flex-shrink-0 w-[272px] flex flex-col">
      {/* Column header */}
      <div className="flex items-center justify-between mb-2.5 px-0.5">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${config.dot}`} />
          <span className="font-semibold text-sm text-slate-700">{stage}</span>
          <span className="bg-slate-200 text-slate-600 text-xs px-1.5 py-0.5 rounded-full font-medium min-w-[20px] text-center">
            {deals.length}
          </span>
        </div>
        {totalValue > 0 && (
          <span className="text-xs text-slate-400 font-medium">{formatCurrency(totalValue)}</span>
        )}
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`flex-1 rounded-xl p-2 transition-all duration-150 min-h-[480px] ${
          isOver
            ? `ring-2 ring-inset ${config.ring} ${config.lightBg}`
            : 'bg-slate-100/80'
        }`}
      >
        <div className="space-y-2">
          {deals.map(deal => (
            <DealCard
              key={deal.id}
              deal={deal}
              onClick={() => onDealClick(deal)}
              isDimmed={isDraggingId !== null && isDraggingId !== deal.id}
            />
          ))}
        </div>

        {deals.length === 0 && !isOver && (
          <div className="flex flex-col items-center justify-center h-24 mt-2">
            <div className="w-8 h-8 border-2 border-dashed border-slate-300 rounded-lg mb-2" />
            <p className="text-xs text-slate-400">Drop deals here</p>
          </div>
        )}

        {isOver && (
          <div className={`rounded-lg border-2 border-dashed ${config.ring} h-20 mt-2 flex items-center justify-center`}>
            <p className={`text-xs font-medium ${config.text}`}>Move to {stage}</p>
          </div>
        )}
      </div>
    </div>
  );
}
