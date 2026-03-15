import { useState } from 'react';
import { X, Plus, ChevronDown } from 'lucide-react';
import { INDUSTRIES } from '../constants';
import { formatCurrencyFull, formatMultiple } from '../utils';

const inputClass = 'w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white placeholder-slate-400 transition-colors';
const selectClass = `${inputClass} appearance-none cursor-pointer`;

function Field({ label, required, children, hint }) {
  return (
    <div>
      <label className="flex items-center gap-1 text-xs font-semibold text-slate-600 mb-1.5">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

const DEFAULT_FORM = {
  companyName: '',
  industry: '',
  stage: 'Sourced',
  location: '',
  annualRevenue: '',
  ebitda: '',
  askingPrice: '',
  description: '',
};

export default function AddDealModal({ stages, onClose, onCreate }) {
  const [form, setForm] = useState({ ...DEFAULT_FORM });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.companyName.trim()) errs.companyName = 'Company name is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreate({
        ...form,
        annualRevenue: form.annualRevenue ? Number(form.annualRevenue) : null,
        ebitda: form.ebitda ? Number(form.ebitda) : null,
        askingPrice: form.askingPrice ? Number(form.askingPrice) : null,
      });
    } catch (err) {
      setErrors({ submit: 'Failed to create deal. Please try again.' });
      setIsSubmitting(false);
    }
  };

  const multiple = form.askingPrice && form.ebitda
    ? `${(Number(form.askingPrice) / Number(form.ebitda)).toFixed(1)}x`
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Add New Deal</h2>
            <p className="text-sm text-slate-500 mt-0.5">Track a new acquisition target in your pipeline</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-6 py-5 space-y-4">
            {/* Company name */}
            <Field label="Company Name" required>
              <input
                type="text"
                value={form.companyName}
                onChange={e => handleChange('companyName', e.target.value)}
                className={`${inputClass} ${errors.companyName ? 'border-red-300 ring-1 ring-red-300' : ''}`}
                placeholder="e.g. Apex HVAC Solutions"
                autoFocus
              />
              {errors.companyName && (
                <p className="text-xs text-red-500 mt-1">{errors.companyName}</p>
              )}
            </Field>

            {/* Industry + Stage */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Industry">
                <div className="relative">
                  <select
                    value={form.industry}
                    onChange={e => handleChange('industry', e.target.value)}
                    className={selectClass}
                  >
                    <option value="">Select industry</option>
                    {INDUSTRIES.map(i => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </Field>

              <Field label="Pipeline Stage">
                <div className="relative">
                  <select
                    value={form.stage}
                    onChange={e => handleChange('stage', e.target.value)}
                    className={selectClass}
                  >
                    {stages.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </Field>
            </div>

            {/* Location */}
            <Field label="Location">
              <input
                type="text"
                value={form.location}
                onChange={e => handleChange('location', e.target.value)}
                className={inputClass}
                placeholder="e.g. Nashville, TN"
              />
            </Field>

            {/* Financials */}
            <div className="bg-slate-50 rounded-xl p-4 space-y-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Financials</p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Annual Revenue" hint={form.annualRevenue ? formatCurrencyFull(Number(form.annualRevenue)) : undefined}>
                  <input
                    type="number"
                    value={form.annualRevenue}
                    onChange={e => handleChange('annualRevenue', e.target.value)}
                    className={inputClass}
                    placeholder="2000000"
                    min="0"
                  />
                </Field>
                <Field label="EBITDA" hint={form.ebitda ? formatCurrencyFull(Number(form.ebitda)) : undefined}>
                  <input
                    type="number"
                    value={form.ebitda}
                    onChange={e => handleChange('ebitda', e.target.value)}
                    className={inputClass}
                    placeholder="400000"
                    min="0"
                  />
                </Field>
              </div>
              <Field label="Asking Price" hint={form.askingPrice ? `${formatCurrencyFull(Number(form.askingPrice))}${multiple ? ` · ${multiple} EBITDA` : ''}` : undefined}>
                <input
                  type="number"
                  value={form.askingPrice}
                  onChange={e => handleChange('askingPrice', e.target.value)}
                  className={inputClass}
                  placeholder="2000000"
                  min="0"
                />
              </Field>
            </div>

            {/* Description */}
            <Field label="Description">
              <textarea
                value={form.description}
                onChange={e => handleChange('description', e.target.value)}
                rows={3}
                className={`${inputClass} resize-none`}
                placeholder="Brief description of the business, key highlights, how you found it..."
              />
            </Field>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                {errors.submit}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-slate-600 hover:text-slate-800 px-4 py-2.5 rounded-lg hover:bg-slate-100 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors shadow-sm"
            >
              <Plus size={16} />
              {isSubmitting ? 'Adding...' : 'Add to Pipeline'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
