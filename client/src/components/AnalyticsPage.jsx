import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from 'recharts';
import { STAGES, STAGE_CONFIG } from '../constants';
import { formatCurrency, timeAgo, formatDateTime } from '../utils';
import { Clock } from 'lucide-react';

// Hex colours to match Tailwind stage palette
const STAGE_HEX = {
  'Sourced':          '#94a3b8',
  'Contacted':        '#3b82f6',
  'NDA Signed':       '#7c3aed',
  'LOI Submitted':    '#f59e0b',
  'Under Diligence':  '#f97316',
  'Closed':           '#10b981',
};

const PIE_PALETTE = [
  '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6',
  '#06b6d4', '#f97316', '#84cc16', '#ec4899',
  '#14b8a6', '#6366f1', '#64748b', '#0ea5e9',
  '#a855f7', '#22c55e', '#fb923c', '#e11d48',
];

// ── Tooltip overrides ──────────────────────────────────────────────────────

function BarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-lg text-xs">
      <div className="font-semibold text-slate-700 mb-0.5">{payload[0].payload.fullStage}</div>
      <div className="text-slate-500">
        {payload[0].value} deal{payload[0].value !== 1 ? 's' : ''}
      </div>
      {payload[0].payload.value > 0 && (
        <div className="text-slate-400 mt-0.5">{formatCurrency(payload[0].payload.value)} total value</div>
      )}
    </div>
  );
}

function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-lg text-xs">
      <div className="font-semibold text-slate-700">{payload[0].name}</div>
      <div className="text-slate-500">{payload[0].value} deal{payload[0].value !== 1 ? 's' : ''}</div>
    </div>
  );
}

// ── Stat card ──────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, valueClass }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{label}</div>
      <div className={`text-2xl font-bold tabular-nums ${valueClass || 'text-slate-900'}`}>{value}</div>
      {sub && <div className="text-xs text-slate-400 mt-1">{sub}</div>}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function AnalyticsPage({ deals }) {
  const activeDeals  = deals.filter(d => d.stage !== 'Closed');
  const closedDeals  = deals.filter(d => d.stage === 'Closed');
  const priced       = deals.filter(d => d.askingPrice);
  const avgDealSize  = priced.length
    ? Math.round(priced.reduce((s, d) => s + d.askingPrice, 0) / priced.length)
    : null;
  const activePipeline = activeDeals.reduce((s, d) => s + (d.askingPrice || 0), 0);
  const closedValue    = closedDeals.reduce((s, d)  => s + (d.askingPrice || 0), 0);

  // Bar chart — deals per stage
  const stageData = STAGES.map(stage => ({
    stage:     stage === 'Under Diligence' ? 'Diligence' : stage === 'LOI Submitted' ? 'LOI' : stage,
    fullStage: stage,
    count:     deals.filter(d => d.stage === stage).length,
    value:     deals.filter(d => d.stage === stage).reduce((s, d) => s + (d.askingPrice || 0), 0),
    color:     STAGE_HEX[stage],
  }));

  // Pie chart — deals per industry
  const industryMap = {};
  deals.forEach(d => {
    if (d.industry) industryMap[d.industry] = (industryMap[d.industry] || 0) + 1;
  });
  const industryData = Object.entries(industryMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // 5 most recently updated
  const recentDeals = [...deals]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  return (
    <div className="p-6 space-y-5 max-w-6xl">

      {/* ── Summary stats ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Deals"
          value={deals.length}
          sub={`${activeDeals.length} active · ${closedDeals.length} closed`}
        />
        <StatCard
          label="Avg Deal Size"
          value={avgDealSize ? formatCurrency(avgDealSize) : '—'}
          sub="Average asking price"
        />
        <StatCard
          label="Active Pipeline"
          value={formatCurrency(activePipeline)}
          sub={`Across ${activeDeals.length} active deal${activeDeals.length !== 1 ? 's' : ''}`}
          valueClass="text-blue-600"
        />
        <StatCard
          label="Total Closed"
          value={formatCurrency(closedValue)}
          sub={`${closedDeals.length} deal${closedDeals.length !== 1 ? 's' : ''} closed`}
          valueClass="text-emerald-600"
        />
      </div>

      {/* ── Charts ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Bar chart — deals by stage */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Deals by Stage</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stageData} barCategoryGap="35%" margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <XAxis
                dataKey="stage"
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                tickLine={false}
                axisLine={false}
                width={28}
              />
              <Tooltip content={<BarTooltip />} cursor={{ fill: '#f8fafc', radius: 4 }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {stageData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart — deals by industry */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Deals by Industry</h3>
          {industryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={industryData}
                  dataKey="value"
                  nameKey="name"
                  cx="38%"
                  cy="50%"
                  outerRadius={82}
                  innerRadius={42}
                  paddingAngle={2}
                >
                  {industryData.map((_, i) => (
                    <Cell key={i} fill={PIE_PALETTE[i % PIE_PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  iconType="circle"
                  iconSize={7}
                  formatter={value => (
                    <span style={{ fontSize: '11px', color: '#64748b' }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[220px] text-slate-400 text-sm">
              No deals to display
            </div>
          )}
        </div>
      </div>

      {/* ── Recently updated ──────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Recently Updated</h3>
        {recentDeals.length === 0 ? (
          <p className="text-sm text-slate-400 py-4 text-center">No deals yet.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentDeals.map(deal => {
              const cfg = STAGE_CONFIG[deal.stage];
              return (
                <div key={deal.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${cfg?.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1 flex-shrink-0 ${cfg?.dot}`} />
                      {deal.stage}
                    </span>
                    <span className="text-sm font-semibold text-slate-800 truncate">{deal.companyName}</span>
                    <span className="hidden sm:block text-xs text-slate-400 truncate">{deal.industry}</span>
                  </div>
                  <div className="flex items-center gap-5 flex-shrink-0 ml-4">
                    <div className="text-right hidden sm:block">
                      <div className="text-sm font-semibold text-slate-800">{formatCurrency(deal.askingPrice)}</div>
                      <div className="text-[10px] text-slate-400">Asking price</div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-400 w-16 justify-end">
                      <Clock size={10} className="flex-shrink-0" />
                      <span title={formatDateTime(deal.updatedAt)}>{timeAgo(deal.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
