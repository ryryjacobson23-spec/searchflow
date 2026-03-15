import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { STAGE_CONFIG } from '../constants';
import { formatCurrency, formatMultiple } from '../utils';
import { MapPin, FileText } from 'lucide-react';

export default function DealCard({ deal, onClick, isOverlay, isDimmed }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: deal.id,
    data: { stage: deal.stage },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const config = STAGE_CONFIG[deal.stage] || STAGE_CONFIG['Sourced'];
  const multiple = deal.askingPrice && deal.ebitda
    ? (deal.askingPrice / deal.ebitda).toFixed(1)
    : null;
  const margin = deal.ebitda && deal.annualRevenue
    ? Math.round((deal.ebitda / deal.annualRevenue) * 100)
    : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={`
        relative bg-white rounded-lg border border-slate-200 overflow-hidden
        cursor-pointer select-none
        transition-all duration-150
        ${isDragging && !isOverlay ? 'opacity-30 scale-95' : ''}
        ${isOverlay ? 'shadow-2xl rotate-1 cursor-grabbing scale-105' : 'hover:shadow-md hover:border-slate-300'}
        ${isDimmed && !isDragging ? 'opacity-60' : ''}
      `}
    >
      {/* Stage accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${config.accent}`} />

      <div className="pl-4 pr-3 pt-3 pb-3">
        {/* Top row: industry + note count */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider leading-tight">
            {deal.industry || 'Unknown Industry'}
          </span>
          {deal.notes && deal.notes.length > 0 && (
            <div className="flex items-center gap-1 text-slate-400 flex-shrink-0">
              <FileText size={10} />
              <span className="text-[10px]">{deal.notes.length}</span>
            </div>
          )}
        </div>

        {/* Company name */}
        <h3 className="font-semibold text-slate-900 text-sm leading-tight mb-2.5">
          {deal.companyName}
        </h3>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs mb-2.5">
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Revenue</div>
            <div className="font-semibold text-slate-700">{formatCurrency(deal.annualRevenue)}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">EBITDA</div>
            <div className="font-semibold text-slate-700">{formatCurrency(deal.ebitda)}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Ask Price</div>
            <div className="font-semibold text-slate-700">{formatCurrency(deal.askingPrice)}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Multiple</div>
            <div className="font-semibold text-slate-700">
              {multiple ? `${multiple}x` : '—'}
              {margin ? <span className="text-slate-400 font-normal ml-1">({margin}%)</span> : null}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          {deal.location ? (
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <MapPin size={9} />
              {deal.location}
            </div>
          ) : (
            <div />
          )}
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${config.badge}`}>
            {deal.stage}
          </span>
        </div>
      </div>
    </div>
  );
}
