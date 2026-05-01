import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createForm } from '../services/api';
import type { Field } from '../types';
import FieldBuilder from '../components/FieldBuilder';

const blank = (): Field => ({ label: '', type: 'text', required: false, options: [] });

export default function CreateForm() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [fields, setFields] = useState<Field[]>([blank()]);
  const [saving, setSaving] = useState(false);

  const addField = () => setFields(prev => [...prev, blank()]);

  const updateField = (i: number, updated: Field) =>
    setFields(prev => prev.map((f, idx) => idx === i ? updated : f));

  const removeField = (i: number) =>
    setFields(prev => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return toast.error('Form needs a title');

    if (fields.some(f => !f.label.trim())) return toast.error('All fields need a label');

    if (fields.some(f => f.type === 'select' && f.options.filter(o => o.trim()).length === 0)) {
      return toast.error('Select fields need at least one option');
    }

    setSaving(true);
    try {
      const clean = fields.map(f => ({ ...f, options: f.options.filter(o => o.trim()) }));
      const form = await createForm({ title, fields: clean });
      toast.success('Form created!');
      navigate(`/form/${form._id}`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      toast.error(msg || 'Failed to create form');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-white">Create New Form</h1>
        <p className="text-slate-400 text-sm mt-1">Add fields below, then share the link.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="card p-6">
          <label className="label text-base">Form Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Job Application 2024"
            className="input text-base"
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-slate-200 text-lg font-semibold">
              Fields <span className="text-sm font-normal text-slate-500">({fields.length})</span>
            </h2>
            <button type="button" onClick={addField} className="btn-secondary">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Field
            </button>
          </div>

          {fields.map((field, i) => (
            <FieldBuilder key={i} field={field} index={i} onChange={updateField} onRemove={removeField} />
          ))}

          {fields.length === 0 && (
            <div className="card p-8 flex flex-col items-center gap-3 border-dashed">
              <p className="text-slate-500 text-sm">No fields yet</p>
              <button type="button" onClick={addField} className="btn-primary">Add first field</button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={() => navigate('/')} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : 'Create Form'}
          </button>
        </div>
      </form>
    </div>
  );
}
