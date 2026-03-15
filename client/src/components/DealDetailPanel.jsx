import { useState, useEffect, useRef } from 'react';
import { X, Trash2, Save, Plus, Clock, ChevronDown, MapPin, Building2, DollarSign } from 'lucide-react';
import { STAGE_CONFIG, INDUSTRIES } from '../constants';
import { formatCurrency, formatCurrencyFull, formatMultiple, formatMargin, formatDateTime, timeAgo } from '../utils';

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass = 'w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white placeholder-slate-400 transition-colors';
const selectClass = `${inputClass} appearance-none cursor-pointer`;

export default function DealDetailPanel({ deal, stages, onClose, onUpdate, onDelete, onNoteAdd, onNoteDelete }) {
  const [form, setForm] = useState({ ...deal });
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const noteInputRef = useRef(null);

  useEffect(() => {
    setForm({ ...deal });
    setIsDirty(false);
    setSaveSuccess(false);
  }, [deal.id]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate(deal.id, form);
      setIsDirty(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddNote = async () => {
    if (!noteContent.trim()) return;
    setIsAddingNote(true);
    try {
      await onNoteAdd(deal.id, noteContent.trim());
      setNoteContent('');
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    await onNoteDelete(deal.id, noteId);
  };

  const handleDelete = async () => {
    await onDelete(deal.id);
  };

  const config = STAGE_CONFIG[form.stage] || STAGE_CONFIG['Sourced'];
  const sortedNotes = [...(deal.notes || [])].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-[520px] bg-white shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-slate-200 flex-shrink-0">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${config.badge}`}>
                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${config.dot}`} />
                {form.stage}
              </span>
              <span className="text-xs text-slate-400">{form.industry}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 truncate">{form.companyName || 'Unnamed Company'}</h2>
            {form.location && (
              <div className="flex items-center gap-1 mt-1 text-sm text-slate-500">
                <MapPin size={12} />
                {form.location}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Key metrics bar */}
        <div className="grid grid-cols-3 divide-x divide-slate-100 bg-slate-50 border-b border-slate-200 flex-shrink-0">
          {[
            { label: 'Revenue', value: formatCurrency(form.annualRevenue) },
            { label: 'EBITDA', value: formatCurrency(form.ebitda) },
            { label: 'Multiple', value: formatMultiple(form.askingPrice, form.ebitda) },
          ].map(({ label, value }) => (
            <div key={label} className="px-4 py-3 text-center">
              <div className="text-xs text-slate-500 mb-0.5">{label}</div>
              <div className="font-bold text-slate-900 text-sm">{value}</div>
            </div>
          ))}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="px-6 py-5 space-y-5">
            {/* Company Details */}
            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Building2 size={12} />
                Company Details
              </h3>
              <div className="space-y-3">
                <Field label="Company Name">
                  <input
                    type="text"
                    value={form.companyName || ''}
                    onChange={e => handleChange('companyName', e.target.value)}
                    className={inputClass}
                    placeholder="Company name"
                  />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Industry">
                    <div className="relative">
                      <select
                        value={form.industry || ''}
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

                  <Field label="Stage">
                    <div className="relative">
                      <select
                        value={form.stage || ''}
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

                <Field label="Location">
                  <input
                    type="text"
                    value={form.location || ''}
                    onChange={e => handleChange('location', e.target.value)}
                    className={inputClass}
                    placeholder="City, State"
                  />
                </Field>

                <Field label="Description">
                  <textarea
                    value={form.description || ''}
                    onChange={e => handleChange('description', e.target.value)}
                    rows={3}
                    className={`${inputClass} resize-none`}
                    placeholder="Business description, key highlights..."
                  />
                </Field>
              </div>
            </section>

            {/* Financials */}
            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <DollarSign size={12} />
                Financials
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Annual Revenue">
                  <input
                    type="number"
                    value={form.annualRevenue ?? ''}
                    onChange={e => handleChange('annualRevenue', e.target.value ? Number(e.target.value) : null)}
                    className={inputClass}
                    placeholder="2000000"
                    min="0"
                  />
                  {form.annualRevenue ? (
                    <p className="text-xs text-slate-400 mt-1">{formatCurrencyFull(form.annualRevenue)}</p>
                  ) : null}
                </Field>

                <Field label="EBITDA">
                  <input
                    type="number"
                    value={form.ebitda ?? ''}
                    onChange={e => handleChange('ebitda', e.target.value ? Number(e.target.value) : null)}
                    className={inputClass}
                    placeholder="400000"
                    min="0"
                  />
                  {form.ebitda && form.annualRevenue ? (
                    <p className="text-xs text-slate-400 mt-1">{formatMargin(form.ebitda, form.annualRevenue)} margin</p>
                  ) : null}
                </Field>

                <Field label="Asking Price">
                  <input
                    type="number"
                    value={form.askingPrice ?? ''}
                    onChange={e => handleChange('askingPrice', e.target.value ? Number(e.target.value) : null)}
                    className={inputClass}
                    placeholder="2000000"
                    min="0"
                  />
                  {form.askingPrice ? (
                    <p className="text-xs text-slate-400 mt-1">{formatCurrencyFull(form.askingPrice)}</p>
                  ) : null}
                </Field>

                <Field label="EBITDA Multiple">
                  <div className={`${inputClass} bg-slate-50 cursor-default text-slate-600`}>
                    {formatMultiple(form.askingPrice, form.ebitda)}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Auto-calculated</p>
                </Field>
              </div>
            </section>

            {/* Notes */}
            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Clock size={12} />
                Notes & Activity
                <span className="bg-slate-100 text-slate-500 text-[10px] px-1.5 py-0.5 rounded-full ml-auto font-medium">
                  {deal.notes?.length || 0}
                </span>
              </h3>

              {/* Add note */}
              <div className="bg-slate-50 rounded-xl p-3 mb-4">
                <textarea
                  ref={noteInputRef}
                  value={noteContent}
                  onChange={e => setNoteContent(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      handleAddNote();
                    }
                  }}
                  rows={3}
                  placeholder="Add a note... (Ctrl+Enter to save)"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleAddNote}
                    disabled={!noteContent.trim() || isAddingNote}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Plus size={12} />
                    {isAddingNote ? 'Adding...' : 'Add Note'}
                  </button>
                </div>
              </div>

              {/* Notes list */}
              {sortedNotes.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">No notes yet.</p>
              ) : (
                <div className="space-y-3">
                  {sortedNotes.map(note => (
                    <div key={note.id} className="group bg-white border border-slate-200 rounded-xl p-3.5">
                      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{note.content}</p>
                      <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-slate-100">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Clock size={10} />
                          <span title={formatDateTime(note.timestamp)}>{timeAgo(note.timestamp)}</span>
                          <span className="text-slate-300">·</span>
                          <span>{formatDateTime(note.timestamp)}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-400 rounded transition-all"
                          title="Delete note"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Footer actions */}
        <div className="border-t border-slate-200 px-6 py-4 flex items-center justify-between bg-white flex-shrink-0">
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-500 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
            >
              <Trash2 size={15} />
              Delete Deal
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-red-600 font-medium">Delete this deal?</span>
              <button
                onClick={handleDelete}
                className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-xs text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}

          <div className="flex items-center gap-3">
            {saveSuccess && (
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <span>✓</span> Saved
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={!isDirty || isSaving}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              <Save size={14} />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
