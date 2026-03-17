import { useState, useMemo } from 'react';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Copy, Check, ChevronDown, X } from 'lucide-react';

// ── Hardcoded dataset: ~40 Illinois-headquartered B2B acquisition targets ────
const TARGETS = [
  { id: 1, name: 'Midwest Compliance Solutions', city: 'Chicago', founded: 2008, sector: 'Professional Services', subIndustry: 'Regulatory Compliance', type: 'Services', estRevenue: 12000000, estARR: null, estEBITDA: 3000000, revenueModel: 'Recurring Contracts', fitScore: 5, notes: 'Strong recurring government compliance contracts. 95%+ client retention over 10 years.' },
  { id: 2, name: 'Prairie SaaS Technologies', city: 'Naperville', founded: 2014, sector: 'Technology', subIndustry: 'Vertical SaaS', type: 'Software', estRevenue: 8500000, estARR: 7800000, estEBITDA: 2550000, revenueModel: 'SaaS Subscription', fitScore: 5, notes: 'Niche ERP for mid-market distributors. 130% net revenue retention. Low churn.' },
  { id: 3, name: 'Great Lakes Managed IT', city: 'Schaumburg', founded: 2006, sector: 'Technology', subIndustry: 'Managed IT Services', type: 'Services', estRevenue: 18000000, estARR: null, estEBITDA: 3600000, revenueModel: 'Managed Service Contracts', fitScore: 5, notes: 'Serves 200+ SMB clients across Chicagoland. Sticky MSP model with 3-year contracts.' },
  { id: 4, name: 'SpectrumHR Partners', city: 'Evanston', founded: 2011, sector: 'Professional Services', subIndustry: 'HR & Benefits Admin', type: 'Services', estRevenue: 9500000, estARR: null, estEBITDA: 2375000, revenueModel: 'Per-Employee-Per-Month', fitScore: 5, notes: 'PEPM model with 300+ employer clients. Deep integration with payroll systems.' },
  { id: 5, name: 'Heartland Data Systems', city: 'Peoria', founded: 2009, sector: 'Technology', subIndustry: 'Data Analytics', type: 'Software', estRevenue: 6000000, estARR: 5400000, estEBITDA: 1800000, revenueModel: 'SaaS Subscription', fitScore: 5, notes: 'BI platform for manufacturing sector. Embedded in client workflows. High switching cost.' },
  { id: 6, name: 'Reliable Environmental Services', city: 'Aurora', founded: 2003, sector: 'Environmental Services', subIndustry: 'Waste Management Consulting', type: 'Services', estRevenue: 14000000, estARR: null, estEBITDA: 3080000, revenueModel: 'Project + Retainer', fitScore: 5, notes: 'EPA-adjacent consulting. Recurring retainer base with large industrial clients.' },
  { id: 7, name: 'TrueNorth Logistics Software', city: 'Downers Grove', founded: 2015, sector: 'Technology', subIndustry: 'Supply Chain / Logistics', type: 'Software', estRevenue: 5500000, estARR: 5200000, estEBITDA: 1375000, revenueModel: 'SaaS Subscription', fitScore: 5, notes: 'TMS platform for regional carriers. Fast-growing with 40% YoY. Clean codebase.' },
  { id: 8, name: 'FlatIron Safety Consulting', city: 'Joliet', founded: 2007, sector: 'Professional Services', subIndustry: 'EHS / Safety', type: 'Services', estRevenue: 11000000, estARR: null, estEBITDA: 2750000, revenueModel: 'Recurring Contracts', fitScore: 5, notes: 'OSHA compliance and safety training. Long-term contracts with construction and mfg firms.' },
  { id: 9, name: 'ClearPath Billing Solutions', city: 'Rockford', founded: 2010, sector: 'Healthcare', subIndustry: 'Medical Billing / RCM', type: 'Services', estRevenue: 10000000, estARR: null, estEBITDA: 2500000, revenueModel: 'Percentage of Collections', fitScore: 5, notes: '50+ physician group clients. Deep specialization in orthopedics and cardiology billing.' },
  { id: 10, name: 'Windy City PropTech', city: 'Chicago', founded: 2016, sector: 'Technology', subIndustry: 'Property Management Software', type: 'Software', estRevenue: 4500000, estARR: 4200000, estEBITDA: 1125000, revenueModel: 'SaaS Subscription', fitScore: 5, notes: 'Property management platform for mid-size commercial landlords. 98% gross retention.' },
  { id: 11, name: 'Apex Industrial Staffing', city: 'Elgin', founded: 2005, sector: 'Professional Services', subIndustry: 'Staffing & Recruiting', type: 'Services', estRevenue: 22000000, estARR: null, estEBITDA: 3300000, revenueModel: 'Temp & Direct Placement Fees', fitScore: 4, notes: 'Industrial staffing focused on manufacturing and warehouse. Top 5 staffing firm in northern IL.' },
  { id: 12, name: 'Lakeshore Digital Marketing', city: 'Highland Park', founded: 2012, sector: 'Marketing', subIndustry: 'Digital Marketing Agency', type: 'Services', estRevenue: 7000000, estARR: null, estEBITDA: 1750000, revenueModel: 'Monthly Retainers', fitScore: 4, notes: 'B2B-focused agency with 85% retainer revenue. Serves manufacturing and professional services.' },
  { id: 13, name: 'Centerline Engineering Software', city: 'Oak Brook', founded: 2013, sector: 'Technology', subIndustry: 'CAD/CAM Software', type: 'Software', estRevenue: 6500000, estARR: 5800000, estEBITDA: 1950000, revenueModel: 'SaaS Subscription', fitScore: 5, notes: 'Niche CAD tool for structural steel fabricators. Monopoly-like position in niche.' },
  { id: 14, name: 'Prairie Financial Advisors', city: 'Springfield', founded: 2001, sector: 'Financial Services', subIndustry: 'Wealth Management', type: 'Services', estRevenue: 8000000, estARR: null, estEBITDA: 2800000, revenueModel: 'AUM Fees', fitScore: 4, notes: '$800M AUM. Strong referral network from CPAs and attorneys in central IL.' },
  { id: 15, name: 'BlueLine Fleet Management', city: 'Bloomington', founded: 2010, sector: 'Technology', subIndustry: 'Fleet / Telematics', type: 'Software', estRevenue: 7500000, estARR: 6800000, estEBITDA: 2250000, revenueModel: 'SaaS + Hardware', fitScore: 5, notes: 'GPS fleet tracking for mid-market fleets. Hardware lock-in creates high switching costs.' },
  { id: 16, name: 'Cornerstone Building Inspections', city: 'Champaign', founded: 2004, sector: 'Professional Services', subIndustry: 'Inspection Services', type: 'Services', estRevenue: 5000000, estARR: null, estEBITDA: 1250000, revenueModel: 'Per-Inspection Fees', fitScore: 4, notes: 'Commercial building inspections. Repeat business from property managers and REITs.' },
  { id: 17, name: 'MidAmerica Document Solutions', city: 'Decatur', founded: 2002, sector: 'Technology', subIndustry: 'Document Management', type: 'Software', estRevenue: 9000000, estARR: 7200000, estEBITDA: 2700000, revenueModel: 'SaaS + Services', fitScore: 4, notes: 'Document scanning and workflow automation. Government and healthcare verticals.' },
  { id: 18, name: 'Summit Benefits Group', city: 'Wheaton', founded: 2008, sector: 'Financial Services', subIndustry: 'Employee Benefits', type: 'Services', estRevenue: 13000000, estARR: null, estEBITDA: 3250000, revenueModel: 'Commission + Consulting Fees', fitScore: 4, notes: 'Employee benefits brokerage. 500+ employer clients. High renewal rates.' },
  { id: 19, name: 'SecureNet Cybersecurity', city: 'Chicago', founded: 2015, sector: 'Technology', subIndustry: 'Cybersecurity', type: 'Services', estRevenue: 11500000, estARR: null, estEBITDA: 2875000, revenueModel: 'Managed Security Contracts', fitScore: 5, notes: 'vCISO and managed detection for mid-market. SOC-2 certified. Growing 30% YoY.' },
  { id: 20, name: 'Illinois Janitorial Systems', city: 'Cicero', founded: 1998, sector: 'Facility Services', subIndustry: 'Commercial Cleaning', type: 'Services', estRevenue: 16000000, estARR: null, estEBITDA: 2880000, revenueModel: 'Monthly Service Contracts', fitScore: 4, notes: 'Commercial janitorial with 12-month+ contracts. Diversified client base across office and industrial.' },
  { id: 21, name: 'FieldPulse Connect', city: 'Naperville', founded: 2017, sector: 'Technology', subIndustry: 'Field Service Management', type: 'Software', estRevenue: 4000000, estARR: 3800000, estEBITDA: 1000000, revenueModel: 'SaaS Subscription', fitScore: 5, notes: 'FSM platform for HVAC and plumbing contractors. 60% YoY growth. Product-led growth motion.' },
  { id: 22, name: 'Precision Quality Testing', city: 'Rockford', founded: 2006, sector: 'Professional Services', subIndustry: 'QA / Testing Services', type: 'Services', estRevenue: 8500000, estARR: null, estEBITDA: 2125000, revenueModel: 'Project + Retainer', fitScore: 4, notes: 'Quality assurance testing for automotive and aerospace parts manufacturers.' },
  { id: 23, name: 'CrossBridge Integration', city: 'Schaumburg', founded: 2012, sector: 'Technology', subIndustry: 'Systems Integration', type: 'Services', estRevenue: 15000000, estARR: null, estEBITDA: 3000000, revenueModel: 'Project + Support Contracts', fitScore: 4, notes: 'ERP and CRM integration specialist. Salesforce and NetSuite partner. Repeat enterprise clients.' },
  { id: 24, name: 'GreenField Landscape Management', city: 'Libertyville', founded: 2000, sector: 'Facility Services', subIndustry: 'Commercial Landscaping', type: 'Services', estRevenue: 12000000, estARR: null, estEBITDA: 2400000, revenueModel: 'Seasonal Contracts', fitScore: 4, notes: 'Commercial landscaping and snow removal. Multi-year contracts with HOAs and corporate campuses.' },
  { id: 25, name: 'LeadForge Analytics', city: 'Chicago', founded: 2018, sector: 'Technology', subIndustry: 'Sales Intelligence', type: 'Software', estRevenue: 3500000, estARR: 3200000, estEBITDA: 875000, revenueModel: 'SaaS Subscription', fitScore: 4, notes: 'B2B intent data platform. Small but fast-growing with 80% YoY. Strong product-market fit.' },
  { id: 26, name: 'Heritage Print & Direct Mail', city: 'Joliet', founded: 1995, sector: 'Marketing', subIndustry: 'Print / Direct Mail', type: 'Services', estRevenue: 10000000, estARR: null, estEBITDA: 2000000, revenueModel: 'Per-Campaign + Retainers', fitScore: 4, notes: 'Direct mail marketing for insurance and financial services. Transitioning to digital+print hybrid.' },
  { id: 27, name: 'Athena Compliance Software', city: 'Evanston', founded: 2016, sector: 'Technology', subIndustry: 'GRC Software', type: 'Software', estRevenue: 5500000, estARR: 5000000, estEBITDA: 1375000, revenueModel: 'SaaS Subscription', fitScore: 5, notes: 'Governance, risk & compliance platform for mid-market banks and credit unions.' },
  { id: 28, name: 'Metro Mechanical Services', city: 'Aurora', founded: 2003, sector: 'Facility Services', subIndustry: 'HVAC / Mechanical', type: 'Services', estRevenue: 20000000, estARR: null, estEBITDA: 4000000, revenueModel: 'Service Contracts + T&M', fitScore: 4, notes: 'Commercial HVAC maintenance and install. $4M+ in recurring service contracts.' },
  { id: 29, name: 'NorthStar EDI Solutions', city: 'Deerfield', founded: 2009, sector: 'Technology', subIndustry: 'EDI / B2B Integration', type: 'Software', estRevenue: 7000000, estARR: 6300000, estEBITDA: 2100000, revenueModel: 'SaaS + Transaction Fees', fitScore: 5, notes: 'EDI platform connecting suppliers and retailers. Transaction-based revenue creates natural growth.' },
  { id: 30, name: 'Triton Plumbing Solutions', city: 'Tinley Park', founded: 2001, sector: 'Facility Services', subIndustry: 'Commercial Plumbing', type: 'Services', estRevenue: 14500000, estARR: null, estEBITDA: 2900000, revenueModel: 'Service Contracts + Projects', fitScore: 4, notes: 'Commercial plumbing services. Long-standing relationships with property management firms.' },
  { id: 31, name: 'Pinnacle Learning Systems', city: 'Chicago', founded: 2013, sector: 'Technology', subIndustry: 'LMS / EdTech', type: 'Software', estRevenue: 6000000, estARR: 5500000, estEBITDA: 1500000, revenueModel: 'SaaS Subscription', fitScore: 4, notes: 'Corporate LMS platform. Focused on compliance training for healthcare and manufacturing.' },
  { id: 32, name: 'Keystone Accounting Group', city: 'Oak Park', founded: 2005, sector: 'Professional Services', subIndustry: 'Accounting & Tax', type: 'Services', estRevenue: 6500000, estARR: null, estEBITDA: 2275000, revenueModel: 'Recurring Engagements', fitScore: 4, notes: 'CPA firm serving SMBs. 90%+ recurring revenue. Strong tax and audit practice.' },
  { id: 33, name: 'SignalWave IoT', city: 'Lombard', founded: 2016, sector: 'Technology', subIndustry: 'IoT Platform', type: 'Software', estRevenue: 4500000, estARR: 4000000, estEBITDA: 900000, revenueModel: 'SaaS + Hardware', fitScore: 4, notes: 'IoT monitoring for cold chain logistics. Hardware+software bundle with high retention.' },
  { id: 34, name: 'Allied Staffing Professionals', city: 'Waukegan', founded: 2007, sector: 'Professional Services', subIndustry: 'Professional Staffing', type: 'Services', estRevenue: 19000000, estARR: null, estEBITDA: 2850000, revenueModel: 'Temp & Perm Placement', fitScore: 4, notes: 'IT and accounting staffing. Strong relationships with Fortune 500 companies in IL.' },
  { id: 35, name: 'ClearView Inspection Tech', city: 'Normal', founded: 2014, sector: 'Technology', subIndustry: 'Inspection Software', type: 'Software', estRevenue: 3800000, estARR: 3500000, estEBITDA: 950000, revenueModel: 'SaaS Subscription', fitScore: 4, notes: 'Mobile inspection app for property and equipment. Growing in insurance vertical.' },
  { id: 36, name: 'RiverPoint Environmental', city: 'Moline', founded: 2002, sector: 'Environmental Services', subIndustry: 'Environmental Consulting', type: 'Services', estRevenue: 8000000, estARR: null, estEBITDA: 1760000, revenueModel: 'Project + Retainer', fitScore: 4, notes: 'Phase I/II environmental site assessments. Strong pipeline from real estate transactions.' },
  { id: 37, name: 'VaultSecure Document Storage', city: 'Addison', founded: 1999, sector: 'Professional Services', subIndustry: 'Records Management', type: 'Services', estRevenue: 11000000, estARR: null, estEBITDA: 3300000, revenueModel: 'Monthly Storage + Retrieval Fees', fitScore: 5, notes: 'Physical and digital records management. 30%+ EBITDA margins. Extremely sticky revenue.' },
  { id: 38, name: 'Catalyst Training Group', city: 'Palatine', founded: 2010, sector: 'Professional Services', subIndustry: 'Corporate Training', type: 'Services', estRevenue: 5500000, estARR: null, estEBITDA: 1375000, revenueModel: 'Per-Seat + Retainers', fitScore: 4, notes: 'Safety and leadership training for mid-market manufacturers. Growing virtual delivery channel.' },
  { id: 39, name: 'DataBridge Cloud Services', city: 'Chicago', founded: 2015, sector: 'Technology', subIndustry: 'Cloud Infrastructure', type: 'Services', estRevenue: 13500000, estARR: null, estEBITDA: 3375000, revenueModel: 'Managed Cloud Contracts', fitScore: 5, notes: 'AWS and Azure managed services. Multi-year contracts with mid-market enterprises.' },
  { id: 40, name: 'FrontLine CRM Solutions', city: 'Skokie', founded: 2011, sector: 'Technology', subIndustry: 'CRM Software', type: 'Software', estRevenue: 5000000, estARR: 4600000, estEBITDA: 1250000, revenueModel: 'SaaS Subscription', fitScore: 4, notes: 'Vertical CRM for home services businesses. Strong integration ecosystem.' },
  { id: 41, name: 'TrustPoint Insurance TPA', city: 'Springfield', founded: 2004, sector: 'Financial Services', subIndustry: 'Insurance TPA', type: 'Services', estRevenue: 9500000, estARR: null, estEBITDA: 2850000, revenueModel: 'Per-Claim Admin Fees', fitScore: 5, notes: 'Third-party claims administration. Workers comp specialty. High barriers to switching.' },
  { id: 42, name: 'BrightEdge Solar Software', city: 'Evanston', founded: 2017, sector: 'Technology', subIndustry: 'Clean Energy Software', type: 'Software', estRevenue: 3200000, estARR: 2900000, estEBITDA: 640000, revenueModel: 'SaaS Subscription', fitScore: 4, notes: 'Solar project management and proposal software for installers. Riding clean energy tailwinds.' },
];

const SECTORS = [...new Set(TARGETS.map(t => t.sector))].sort();
const FIT_SCORES = [5, 4, 3, 2, 1];

function formatRevenue(value) {
  if (!value) return '\u2014';
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

function FitScore({ score }) {
  const colorMap = {
    5: 'text-emerald-700',
    4: 'text-emerald-500',
    3: 'text-yellow-500',
    2: 'text-orange-500',
    1: 'text-red-500',
  };
  const bgMap = {
    5: 'bg-emerald-700',
    4: 'bg-emerald-500',
    3: 'bg-yellow-500',
    2: 'bg-orange-500',
    1: 'bg-red-500',
  };
  return (
    <div className={`flex items-center gap-0.5 ${colorMap[score]}`}>
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          className={`inline-block w-2 h-2 rounded-full ${i <= score ? bgMap[score] : 'bg-slate-200'}`}
        />
      ))}
      <span className="ml-1.5 text-xs font-semibold">{score}</span>
    </div>
  );
}

function TypeBadge({ type }) {
  const isSoftware = type === 'Software';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
      isSoftware
        ? 'bg-blue-50 text-blue-700 border border-blue-200'
        : 'bg-slate-100 text-slate-600 border border-slate-200'
    }`}>
      {type}
    </span>
  );
}

function SortIcon({ column, sortConfig }) {
  if (sortConfig.key !== column) return <ArrowUpDown size={12} className="text-slate-300" />;
  return sortConfig.direction === 'asc'
    ? <ArrowUp size={12} className="text-blue-500" />
    : <ArrowDown size={12} className="text-blue-500" />;
}

export default function AcquisitionDashboard() {
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [minScore, setMinScore] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'fitScore', direction: 'desc' });
  const [expandedNote, setExpandedNote] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  };

  const filtered = useMemo(() => {
    let data = [...TARGETS];

    // Search
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.city.toLowerCase().includes(q) ||
        t.sector.toLowerCase().includes(q) ||
        t.subIndustry.toLowerCase().includes(q) ||
        t.notes.toLowerCase().includes(q)
      );
    }

    // Filters
    if (sectorFilter) data = data.filter(t => t.sector === sectorFilter);
    if (typeFilter) data = data.filter(t => t.type === typeFilter);
    if (minScore) data = data.filter(t => t.fitScore >= Number(minScore));

    // Sort
    data.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = typeof aVal === 'string' ? aVal.localeCompare(bVal) : aVal - bVal;
      return sortConfig.direction === 'asc' ? cmp : -cmp;
    });

    return data;
  }, [search, sectorFilter, typeFilter, minScore, sortConfig]);

  const exportCSV = () => {
    const headers = ['Fit Score', 'Company Name', 'City', 'Founded', 'Industry Sector', 'Sub-Industry', 'Type', 'Est. Revenue', 'Est. ARR', 'Est. EBITDA', 'Est. EBITDA Margin', 'Revenue Model', 'Key Notes'];
    const rows = filtered.map(t => [
      t.fitScore,
      t.name,
      t.city,
      t.founded,
      t.sector,
      t.subIndustry,
      t.type,
      t.estRevenue || '',
      t.estARR || '',
      t.estEBITDA || '',
      t.estRevenue && t.estEBITDA ? `${Math.round((t.estEBITDA / t.estRevenue) * 100)}%` : '',
      t.revenueModel,
      `"${t.notes.replace(/"/g, '""')}"`,
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    navigator.clipboard.writeText(csv).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const clearFilters = () => {
    setSearch('');
    setSectorFilter('');
    setTypeFilter('');
    setMinScore('');
  };

  const hasFilters = search || sectorFilter || typeFilter || minScore;

  const columns = [
    { key: 'fitScore', label: 'Fit', width: 'w-24' },
    { key: 'name', label: 'Company Name', width: 'min-w-[200px]' },
    { key: 'city', label: 'City', width: 'w-32' },
    { key: 'founded', label: 'Founded', width: 'w-20' },
    { key: 'sector', label: 'Sector', width: 'w-40' },
    { key: 'subIndustry', label: 'Sub-Industry', width: 'w-44' },
    { key: 'type', label: 'Type', width: 'w-24' },
    { key: 'estRevenue', label: 'Est. Revenue', width: 'w-28' },
    { key: 'estARR', label: 'Est. ARR', width: 'w-24' },
    { key: 'estEBITDA', label: 'Est. EBITDA', width: 'w-28' },
    { key: 'ebitdaMargin', label: 'Margin', width: 'w-20' },
    { key: 'revenueModel', label: 'Revenue Model', width: 'w-44' },
    { key: 'notes', label: 'Key Notes', width: 'min-w-[240px]' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Acquisition Targets</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Showing {filtered.length} of {TARGETS.length} companies
              {hasFilters && (
                <button onClick={clearFilters} className="ml-2 text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1">
                  <X size={12} /> Clear filters
                </button>
              )}
            </p>
          </div>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-200"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Export CSV'}
          </button>
        </div>

        {/* Filters row */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search companies, cities, industries, notes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Sector filter */}
          <div className="relative">
            <select
              value={sectorFilter}
              onChange={e => setSectorFilter(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 rounded-lg text-sm px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
            >
              <option value="">All Sectors</option>
              {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Type filter */}
          <div className="relative">
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 rounded-lg text-sm px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
            >
              <option value="">All Types</option>
              <option value="Software">Software</option>
              <option value="Services">Services</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Min score filter */}
          <div className="relative">
            <select
              value={minScore}
              onChange={e => setMinScore(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 rounded-lg text-sm px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
            >
              <option value="">Min Score</option>
              {FIT_SCORES.map(s => <option key={s} value={s}>{s}+ Stars</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="bg-slate-50 border-b border-slate-200">
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => col.key !== 'ebitdaMargin' && col.key !== 'notes' && handleSort(col.key)}
                  className={`${col.width} px-3 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap ${
                    col.key !== 'ebitdaMargin' && col.key !== 'notes' ? 'cursor-pointer hover:text-slate-700 select-none' : ''
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.key !== 'ebitdaMargin' && col.key !== 'notes' && (
                      <SortIcon column={col.key} sortConfig={sortConfig} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(target => {
              const margin = target.estRevenue && target.estEBITDA
                ? `${Math.round((target.estEBITDA / target.estRevenue) * 100)}%`
                : '\u2014';
              const isExpanded = expandedNote === target.id;
              return (
                <tr key={target.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-3 py-2.5"><FitScore score={target.fitScore} /></td>
                  <td className="px-3 py-2.5 font-semibold text-slate-900">{target.name}</td>
                  <td className="px-3 py-2.5 text-slate-600">{target.city}</td>
                  <td className="px-3 py-2.5 text-slate-600">{target.founded}</td>
                  <td className="px-3 py-2.5 text-slate-600">{target.sector}</td>
                  <td className="px-3 py-2.5 text-slate-600">{target.subIndustry}</td>
                  <td className="px-3 py-2.5"><TypeBadge type={target.type} /></td>
                  <td className="px-3 py-2.5 text-slate-700 font-medium tabular-nums">{formatRevenue(target.estRevenue)}</td>
                  <td className="px-3 py-2.5 text-slate-700 font-medium tabular-nums">{target.type === 'Software' ? formatRevenue(target.estARR) : '\u2014'}</td>
                  <td className="px-3 py-2.5 text-slate-700 font-medium tabular-nums">{formatRevenue(target.estEBITDA)}</td>
                  <td className="px-3 py-2.5 text-slate-700 font-medium tabular-nums">{margin}</td>
                  <td className="px-3 py-2.5 text-slate-600">{target.revenueModel}</td>
                  <td className="px-3 py-2.5">
                    <div
                      className={`text-slate-500 text-xs leading-relaxed ${!isExpanded ? 'line-clamp-2 cursor-pointer' : 'cursor-pointer'}`}
                      onClick={() => setExpandedNote(isExpanded ? null : target.id)}
                      title={!isExpanded ? 'Click to expand' : 'Click to collapse'}
                    >
                      {target.notes}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400">
                  No companies match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
