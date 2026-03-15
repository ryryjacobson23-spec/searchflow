import { SlidersHorizontal, X } from 'lucide-react';

const inputClass =
  'border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 bg-white ' +
  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400';

export default function FilterBar({ industries, filters, onFiltersChange, filteredCount, totalCount }) {
  const hasFilters = filters.industry || filters.minPrice || filters.maxPrice;

  const set = (key, val) => onFiltersChange({ ...filters, [key]: val });
  const clear = () => onFiltersChange({ industry: '', minPrice: '', maxPrice: '' });

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center gap-3 flex-shrink-0">
      <SlidersHorizontal size={14} className="text-slate-400 flex-shrink-0" />

      {/* Industry */}
      <select
        value={filters.industry}
        onChange={e => set('industry', e.target.value)}
        className={inputClass}
      >
        <option value="">All Industries</option>
        {industries.map(ind => (
          <option key={ind} value={ind}>{ind}</option>
        ))}
      </select>

      {/* Deal size (asking price) range */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Deal Size</span>
        <input
          type="number"
          placeholder="Min $"
          value={filters.minPrice}
          onChange={e => set('minPrice', e.target.value)}
          className={`${inputClass} w-28`}
          min="0"
        />
        <span className="text-slate-300 text-sm">–</span>
        <input
          type="number"
          placeholder="Max $"
          value={filters.maxPrice}
          onChange={e => set('maxPrice', e.target.value)}
          className={`${inputClass} w-28`}
          min="0"
        />
      </div>

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={clear}
          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          <X size={12} />
          Clear
        </button>
      )}

      {/* Result count */}
      <div className="ml-auto text-xs text-slate-400">
        {hasFilters
          ? <><span className="font-semibold text-slate-600">{filteredCount}</span> of {totalCount} deals</>
          : <>{totalCount} deal{totalCount !== 1 ? 's' : ''}</>
        }
      </div>
    </div>
  );
}
