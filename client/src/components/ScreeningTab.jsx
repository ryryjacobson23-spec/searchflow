import { CheckCircle, AlertTriangle, XCircle, TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';
import { formatCurrency, formatCurrencyFull } from '../utils';

// ─── Calculation helpers ───────────────────────────────────────────────────

function pct(num, denom) {
  if (!num || !denom || denom === 0) return null;
  return (num / denom) * 100;
}

function growth(a, b) {
  if (!a || !b || a === 0) return null;
  return ((b - a) / a) * 100;
}

function cagr(start, end, n) {
  if (!start || !end || start === 0 || n <= 0) return null;
  return (Math.pow(end / start, 1 / n) - 1) * 100;
}

// ─── Scorecard status logic ────────────────────────────────────────────────

function getStatus(metric, value) {
  if (value === null || value === undefined || isNaN(value)) return null;
  switch (metric) {
    case 'ebitda':
      if (value >= 1_000_000 && value <= 5_000_000) return 'green';
      if (value >= 500_000) return 'yellow';
      return 'red';
    case 'ebitdaMargin':
      if (value >= 15) return 'green';
      if (value >= 10) return 'yellow';
      return 'red';
    case 'customerConcentration':
      if (value < 25) return 'green';
      if (value < 40) return 'yellow';
      return 'red';
    case 'recurringRevenue':
      if (value >= 50) return 'green';
      if (value >= 30) return 'yellow';
      return 'red';
    case 'revenueGrowth':
      if (value >= 10) return 'green';
      if (value >= 5) return 'yellow';
      return 'red';
    default:
      return null;
  }
}

const STATUS_CONFIG = {
  green: {
    Icon: CheckCircle,
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    text: 'text-emerald-700',
    valueBg: 'bg-emerald-100',
    dot: 'bg-emerald-500',
    label: 'Pass',
    bar: 'bg-emerald-500',
  },
  yellow: {
    Icon: AlertTriangle,
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    text: 'text-amber-700',
    valueBg: 'bg-amber-100',
    dot: 'bg-amber-500',
    label: 'Review',
    bar: 'bg-amber-400',
  },
  red: {
    Icon: XCircle,
    bg: 'bg-red-50',
    border: 'border-red-100',
    text: 'text-red-700',
    valueBg: 'bg-red-100',
    dot: 'bg-red-500',
    label: 'Fail',
    bar: 'bg-red-400',
  },
};

// ─── Sub-components ────────────────────────────────────────────────────────

function ScorecardRow({ label, criteria, metric, value, displayValue }) {
  const status = getStatus(metric, value);
  const cfg = status ? STATUS_CONFIG[status] : null;
  const Icon = cfg?.Icon;

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border ${cfg ? `${cfg.bg} ${cfg.border}` : 'bg-slate-50 border-slate-100'}`}>
      {/* Status dot */}
      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${cfg ? cfg.dot : 'bg-slate-300'}`} />

      {/* Label + criteria */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-slate-800 leading-tight">{label}</div>
        <div className="text-[11px] text-slate-500 mt-0.5">{criteria}</div>
      </div>

      {/* Value */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className={`text-sm font-bold tabular-nums ${cfg ? cfg.text : 'text-slate-400'}`}>
          {displayValue ?? '—'}
        </span>
        {cfg && (
          <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full ${cfg.valueBg} ${cfg.text}`}>
            <Icon size={10} />
            {cfg.label}
          </span>
        )}
        {!cfg && (
          <span className="text-[11px] text-slate-400 px-2 py-1 bg-slate-100 rounded-full">N/A</span>
        )}
      </div>
    </div>
  );
}

function ProgressBar({ value, max = 100, status, label }) {
  const cfg = status ? STATUS_CONFIG[status] : null;
  const pct = max > 0 ? Math.min((Math.abs(value) / max) * 100, 100) : 0;
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs text-slate-600">{label}</span>
        <span className={`text-xs font-bold tabular-nums ${cfg ? cfg.text : 'text-slate-500'}`}>
          {value !== null ? `${value}%` : '—'}
        </span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${cfg ? cfg.bar : 'bg-slate-300'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function TrendIndicator({ value, suffix = '%', green = 10, yellow = 5, invert = false }) {
  if (value === null || value === undefined) return <span className="text-slate-400 text-xs">—</span>;
  const isGood = invert ? value < green : value > green;
  const isMid = invert ? value < yellow : value > yellow;
  const color = isGood ? 'text-emerald-600' : isMid ? 'text-amber-600' : 'text-red-500';
  const Icon = value > 0.5 ? TrendingUp : value < -0.5 ? TrendingDown : Minus;

  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold tabular-nums ${color}`}>
      <Icon size={12} />
      {value >= 0 ? '+' : ''}{value.toFixed(1)}{suffix}
    </span>
  );
}

// Cell styling
const cellInputClass = 'w-full border border-slate-200 rounded-md px-2 py-1.5 text-xs text-right font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-transparent bg-white placeholder-slate-300 hover:border-slate-300 transition-colors';
const cellReadClass = 'w-full px-2 py-1.5 text-xs text-right font-semibold tabular-nums';
const fieldInputClass = 'w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white placeholder-slate-400 transition-colors';

// Default empty screening structure
export function defaultScreening(deal) {
  return {
    years: [2021, 2022, 2023],
    revenue: [null, null, deal?.annualRevenue || null],
    ebitda: [null, null, deal?.ebitda || null],
    grossMargin: null,
    customerConcentration: null,
    recurringRevenue: null,
    askingPrice: deal?.askingPrice || null,
  };
}

// ─── Main component ────────────────────────────────────────────────────────

export default function ScreeningTab({ data, onChange }) {
  const s = data;
  const rev = s.revenue || [null, null, null];
  const eb = s.ebitda || [null, null, null];
  const years = s.years || [2021, 2022, 2023];

  // Derived calculations
  const ebitdaMargins = years.map((_, i) => pct(eb[i], rev[i]));
  const revGrowths = [null, growth(rev[0], rev[1]), growth(rev[1], rev[2])];
  const latestEbitda = eb[2];
  const latestMargin = ebitdaMargins[2];
  const latestGrowth = revGrowths[2];
  const evEbitda = s.askingPrice && eb[2] ? s.askingPrice / eb[2] : null;
  const revCagr = cagr(rev[0], rev[2], 2);
  const midMargin = ebitdaMargins[1];

  const maxRev = Math.max(...rev.filter(Boolean), 1);

  // Scorecard statuses
  const scorecardItems = [
    { metric: 'ebitda', value: latestEbitda, displayValue: latestEbitda ? formatCurrency(latestEbitda) : null },
    { metric: 'ebitdaMargin', value: latestMargin, displayValue: latestMargin ? `${latestMargin.toFixed(1)}%` : null },
    { metric: 'customerConcentration', value: s.customerConcentration, displayValue: s.customerConcentration != null ? `${s.customerConcentration}%` : null },
    { metric: 'recurringRevenue', value: s.recurringRevenue, displayValue: s.recurringRevenue != null ? `${s.recurringRevenue}%` : null },
    { metric: 'revenueGrowth', value: latestGrowth, displayValue: latestGrowth != null ? `${latestGrowth >= 0 ? '+' : ''}${latestGrowth.toFixed(1)}%` : null },
  ];
  const statuses = scorecardItems.map(item => getStatus(item.metric, item.value));
  const greenCount = statuses.filter(s => s === 'green').length;
  const yellowCount = statuses.filter(s => s === 'yellow').length;
  const redCount = statuses.filter(s => s === 'red').length;
  const scoredCount = statuses.filter(Boolean).length;

  const overallSignal = scoredCount === 0 ? null
    : greenCount >= 4 ? { label: 'Strong Buy', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' }
    : greenCount >= 3 ? { label: 'Moderate', color: 'text-blue-700 bg-blue-50 border-blue-200' }
    : greenCount >= 2 ? { label: 'Cautious', color: 'text-amber-700 bg-amber-50 border-amber-200' }
    : { label: 'Weak', color: 'text-red-700 bg-red-50 border-red-200' };

  // Handlers
  const setRev = (i, val) => {
    const next = [...rev];
    next[i] = val !== '' && val !== null ? Number(val) : null;
    onChange({ ...s, revenue: next });
  };
  const setEb = (i, val) => {
    const next = [...eb];
    next[i] = val !== '' && val !== null ? Number(val) : null;
    onChange({ ...s, ebitda: next });
  };
  const setField = (field, val) => {
    onChange({ ...s, [field]: val !== '' && val !== null ? Number(val) : null });
  };

  // Display helpers
  const fmtMargin = (m) => m !== null ? `${m.toFixed(1)}%` : '—';
  const fmtGrowth = (g) => g === null ? '—' : `${g >= 0 ? '+' : ''}${g.toFixed(1)}%`;
  const marginColor = (m) => m === null ? 'text-slate-400' : m >= 15 ? 'text-emerald-600' : m >= 10 ? 'text-amber-600' : 'text-red-500';
  const growthColor = (g) => g === null ? 'text-slate-400' : g >= 10 ? 'text-emerald-600' : g >= 5 ? 'text-amber-600' : g >= 0 ? 'text-slate-600' : 'text-red-500';

  return (
    <div className="px-6 py-5 space-y-7">

      {/* ── 1. Financial History ─────────────────────────────────────── */}
      <section>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <BarChart3 size={12} />
          Financial History
        </h3>

        {/* Mini bar chart */}
        {(rev.some(Boolean) || eb.some(Boolean)) && (
          <div className="bg-slate-50 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-2 bg-blue-400 rounded-sm" />
                <span className="text-[10px] text-slate-500 font-medium">Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-2 bg-emerald-400 rounded-sm" />
                <span className="text-[10px] text-slate-500 font-medium">EBITDA</span>
              </div>
              {revCagr !== null && (
                <div className="ml-auto">
                  <TrendIndicator value={revCagr} suffix="% CAGR" green={10} yellow={5} />
                </div>
              )}
            </div>
            <div className="flex items-end gap-4" style={{ height: '68px' }}>
              {years.map((year, i) => (
                <div key={year} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full flex items-end gap-1" style={{ height: '52px' }}>
                    <div
                      className="flex-1 bg-blue-300 hover:bg-blue-400 rounded-t-sm transition-colors cursor-default"
                      style={{
                        height: rev[i] ? `${(rev[i] / maxRev) * 100}%` : '4px',
                        minHeight: '4px',
                      }}
                      title={rev[i] ? `Revenue: ${formatCurrencyFull(rev[i])}` : 'No data'}
                    />
                    <div
                      className="flex-1 bg-emerald-400 hover:bg-emerald-500 rounded-t-sm transition-colors cursor-default"
                      style={{
                        height: eb[i] ? `${(eb[i] / maxRev) * 100}%` : '4px',
                        minHeight: '4px',
                      }}
                      title={eb[i] ? `EBITDA: ${formatCurrencyFull(eb[i])}` : 'No data'}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium tabular-nums">{year}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Editable financial table */}
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left py-2.5 px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider w-[34%]">Metric</th>
                {years.map(y => (
                  <th key={y} className="text-right py-2.5 px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider tabular-nums">{y}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">

              {/* Revenue — editable */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-2 px-3 text-xs font-semibold text-slate-700">Revenue</td>
                {years.map((_, i) => (
                  <td key={i} className="py-2 px-3">
                    <input
                      type="number"
                      value={rev[i] ?? ''}
                      onChange={e => setRev(i, e.target.value)}
                      className={cellInputClass}
                      placeholder="—"
                      min="0"
                    />
                    {rev[i] ? (
                      <div className="text-[9px] text-slate-400 text-right mt-0.5 pr-1">{formatCurrency(rev[i])}</div>
                    ) : null}
                  </td>
                ))}
              </tr>

              {/* EBITDA — editable */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-2 px-3 text-xs font-semibold text-slate-700">EBITDA</td>
                {years.map((_, i) => (
                  <td key={i} className="py-2 px-3">
                    <input
                      type="number"
                      value={eb[i] ?? ''}
                      onChange={e => setEb(i, e.target.value)}
                      className={cellInputClass}
                      placeholder="—"
                      min="0"
                    />
                    {eb[i] ? (
                      <div className="text-[9px] text-slate-400 text-right mt-0.5 pr-1">{formatCurrency(eb[i])}</div>
                    ) : null}
                  </td>
                ))}
              </tr>

              {/* EBITDA Margin — calculated */}
              <tr className="bg-slate-50/40">
                <td className="py-2.5 px-3 text-[11px] font-medium text-slate-400 italic">EBITDA Margin</td>
                {ebitdaMargins.map((m, i) => (
                  <td key={i} className={`${cellReadClass} ${marginColor(m)}`}>
                    {fmtMargin(m)}
                  </td>
                ))}
              </tr>

              {/* YoY Revenue Growth — calculated */}
              <tr className="bg-slate-50/40">
                <td className="py-2.5 px-3 text-[11px] font-medium text-slate-400 italic">Rev Growth YoY</td>
                {revGrowths.map((g, i) => (
                  <td key={i} className={`${cellReadClass} ${growthColor(g)}`}>
                    {fmtGrowth(g)}
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>
      </section>

      {/* ── 2. Operating Metrics ─────────────────────────────────────── */}
      <section>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Operating Metrics</h3>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { key: 'grossMargin', label: 'Gross Margin', placeholder: '65', suffix: '%', hint: 'Revenue minus COGS as % of revenue' },
            { key: 'customerConcentration', label: 'Customer Concentration', placeholder: '20', suffix: '%', hint: 'Largest single customer as % of revenue' },
            { key: 'recurringRevenue', label: 'Recurring Revenue', placeholder: '70', suffix: '%', hint: '% of revenue from contracts or subscriptions' },
          ].map(({ key, label, placeholder, suffix, hint }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
              <div className="relative">
                <input
                  type="number"
                  value={s[key] ?? ''}
                  onChange={e => setField(key, e.target.value)}
                  className={`${fieldInputClass} pr-8`}
                  placeholder={placeholder}
                  min="0"
                  max="100"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 pointer-events-none">{suffix}</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">{hint}</p>
            </div>
          ))}

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Asking Price</label>
            <input
              type="number"
              value={s.askingPrice ?? ''}
              onChange={e => setField('askingPrice', e.target.value)}
              className={fieldInputClass}
              placeholder="2000000"
              min="0"
            />
            {s.askingPrice ? (
              <p className="text-[10px] text-slate-400 mt-1">{formatCurrencyFull(s.askingPrice)}</p>
            ) : null}
          </div>
        </div>

        {/* Progress bars for percentage metrics */}
        {(s.grossMargin != null || s.customerConcentration != null || s.recurringRevenue != null) && (
          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            {s.grossMargin != null && (
              <ProgressBar
                value={s.grossMargin}
                max={100}
                status={s.grossMargin >= 50 ? 'green' : s.grossMargin >= 35 ? 'yellow' : 'red'}
                label="Gross Margin"
              />
            )}
            {s.recurringRevenue != null && (
              <ProgressBar
                value={s.recurringRevenue}
                max={100}
                status={getStatus('recurringRevenue', s.recurringRevenue)}
                label="Recurring Revenue"
              />
            )}
            {s.customerConcentration != null && (
              <ProgressBar
                value={s.customerConcentration}
                max={100}
                status={getStatus('customerConcentration', s.customerConcentration)}
                label="Customer Concentration (lower is better)"
              />
            )}
          </div>
        )}
      </section>

      {/* ── 3. Key Metrics ───────────────────────────────────────────── */}
      {(evEbitda !== null || revCagr !== null || latestMargin !== null) && (
        <section>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Calculated Metrics</h3>
          <div className="grid grid-cols-3 gap-3">

            <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">EV / EBITDA</div>
              <div className={`text-xl font-bold tabular-nums ${evEbitda !== null ? (evEbitda <= 5 ? 'text-emerald-600' : evEbitda <= 7 ? 'text-amber-600' : 'text-red-500') : 'text-slate-400'}`}>
                {evEbitda !== null ? `${evEbitda.toFixed(1)}x` : '—'}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                {evEbitda !== null ? (evEbitda <= 5 ? 'Attractive' : evEbitda <= 7 ? 'Market rate' : 'Rich valuation') : 'Enter asking price + EBITDA'}
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Rev CAGR</div>
              <div className={`text-xl font-bold tabular-nums ${revCagr !== null ? (revCagr >= 10 ? 'text-emerald-600' : revCagr >= 5 ? 'text-amber-600' : 'text-red-500') : 'text-slate-400'}`}>
                {revCagr !== null ? `${revCagr >= 0 ? '+' : ''}${revCagr.toFixed(1)}%` : '—'}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">2-year compound growth</div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">EBITDA Margin</div>
              <div className={`text-xl font-bold tabular-nums ${latestMargin !== null ? (latestMargin >= 15 ? 'text-emerald-600' : latestMargin >= 10 ? 'text-amber-600' : 'text-red-500') : 'text-slate-400'}`}>
                {latestMargin !== null ? `${latestMargin.toFixed(1)}%` : '—'}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                {midMargin !== null && latestMargin !== null
                  ? latestMargin > midMargin ? '↑ Expanding' : latestMargin < midMargin ? '↓ Contracting' : '→ Stable'
                  : 'Latest year'}
              </div>
            </div>

          </div>
        </section>
      )}

      {/* ── 4. Screening Scorecard ───────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Screening Scorecard</h3>
          {overallSignal && (
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${overallSignal.color}`}>
              {overallSignal.label}
            </span>
          )}
        </div>

        {/* Score summary bar */}
        {scoredCount > 0 && (
          <div className="flex items-center gap-2 mb-4 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
            <div className="flex gap-1.5 flex-1">
              {Array.from({ length: 5 }).map((_, i) => {
                const st = statuses[i];
                const cfg = st ? STATUS_CONFIG[st] : null;
                return (
                  <div
                    key={i}
                    className={`flex-1 h-2 rounded-full ${cfg ? cfg.bar : 'bg-slate-200'}`}
                  />
                );
              })}
            </div>
            <div className="flex items-center gap-3 text-xs ml-2">
              {greenCount > 0 && (
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <CheckCircle size={11} />{greenCount}
                </span>
              )}
              {yellowCount > 0 && (
                <span className="flex items-center gap-1 text-amber-600 font-semibold">
                  <AlertTriangle size={11} />{yellowCount}
                </span>
              )}
              {redCount > 0 && (
                <span className="flex items-center gap-1 text-red-500 font-semibold">
                  <XCircle size={11} />{redCount}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Individual rows */}
        <div className="space-y-2">
          <ScorecardRow
            label="EBITDA Size"
            criteria="Target range: $1M – $5M for SBA-eligible search"
            metric="ebitda"
            value={latestEbitda}
            displayValue={latestEbitda ? formatCurrency(latestEbitda) : null}
          />
          <ScorecardRow
            label="EBITDA Margin"
            criteria="Minimum 15% for healthy unit economics"
            metric="ebitdaMargin"
            value={latestMargin}
            displayValue={latestMargin != null ? `${latestMargin.toFixed(1)}%` : null}
          />
          <ScorecardRow
            label="Customer Concentration"
            criteria="Top customer < 25% of revenue (lower is better)"
            metric="customerConcentration"
            value={s.customerConcentration}
            displayValue={s.customerConcentration != null ? `${s.customerConcentration}%` : null}
          />
          <ScorecardRow
            label="Recurring Revenue"
            criteria="50%+ for predictable, contracted cash flows"
            metric="recurringRevenue"
            value={s.recurringRevenue}
            displayValue={s.recurringRevenue != null ? `${s.recurringRevenue}%` : null}
          />
          <ScorecardRow
            label="Revenue Growth"
            criteria="10%+ YoY indicates strong market position"
            metric="revenueGrowth"
            value={latestGrowth}
            displayValue={latestGrowth != null ? `${latestGrowth >= 0 ? '+' : ''}${latestGrowth.toFixed(1)}%` : null}
          />
        </div>

        {scoredCount === 0 && (
          <p className="text-sm text-slate-400 text-center py-6">
            Enter financial data above to generate the scorecard.
          </p>
        )}
      </section>

    </div>
  );
}
