export function formatCurrency(value) {
  if (value === null || value === undefined || value === '') return '—';
  const num = Number(value);
  if (isNaN(num)) return '—';
  if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `$${(num / 1000).toFixed(0)}K`;
  }
  return `$${num.toLocaleString()}`;
}

export function formatCurrencyFull(value) {
  if (value === null || value === undefined || value === '') return '—';
  const num = Number(value);
  if (isNaN(num)) return '—';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
}

export function formatMultiple(askingPrice, ebitda) {
  if (!askingPrice || !ebitda || ebitda === 0) return '—';
  return `${(askingPrice / ebitda).toFixed(1)}x`;
}

export function formatMargin(ebitda, revenue) {
  if (!ebitda || !revenue || revenue === 0) return '—';
  return `${Math.round((ebitda / revenue) * 100)}%`;
}

export function formatDate(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function timeAgo(isoString) {
  if (!isoString) return '';
  const seconds = Math.floor((Date.now() - new Date(isoString)) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(isoString);
}
