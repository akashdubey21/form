import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getFormById, submitResponse } from '../services/api';
import type { Form } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

export default function FormRenderer() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [fetchErr, setFetchErr] = useState('');

  useEffect(() => {
    if (!id) return;
    getFormById(id)
      .then(f => {
        setForm(f);
        const init: Record<string, string> = {};
        f.fields.forEach(field => { init[field.label] = ''; });
        setAnswers(init);
      })
      .catch(() => setFetchErr('Form not found or server is down.'))
      .finally(() => setLoading(false));
  }, [id]);

  const validate = () => {
    if (!form) return false;
    const newErrs: Record<string, string> = {};

    form.fields.forEach(field => {
      const val = answers[field.label]?.trim() ?? '';
      if (field.required && !val) {
        newErrs[field.label] = 'Required';
        return;
      }
      if (val && field.type === 'number' && isNaN(Number(val))) {
        newErrs[field.label] = 'Must be a number';
      }
    });

    setErrors(newErrs);
    return Object.keys(newErrs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !id) return;

    setSubmitting(true);
    try {
      const payload: Record<string, string | number> = {};
      form!.fields.forEach(field => {
        const val = answers[field.label];
        payload[field.label] = field.type === 'number' ? Number(val) : val;
      });

      await submitResponse(id, payload);
      setDone(true);
      toast.success('Response submitted! 🎉');
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { errors?: string[]; error?: string } } };
      const msgs = apiErr?.response?.data?.errors ?? [apiErr?.response?.data?.error ?? 'Submission failed'];
      msgs.forEach(m => toast.error(m));
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setDone(false);
    const init: Record<string, string> = {};
    form?.fields.forEach(f => { init[f.label] = ''; });
    setAnswers(init);
  };

  if (loading) return <LoadingSpinner message="Loading form..." />;

  if (fetchErr) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="text-5xl mb-4">😕</div>
      <h2 className="text-slate-200 text-xl font-semibold">Form Not Found</h2>
      <p className="text-slate-500 text-sm mt-2">{fetchErr}</p>
    </div>
  );

  if (done) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-fade-in">
      <div className="text-6xl mb-6">🎉</div>
      <div className="card p-8">
        <h2 className="text-2xl font-bold text-white mb-2">Submitted!</h2>
        <p className="text-slate-400">
          Thanks for filling out <span className="text-brand-300 font-semibold">{form?.title}</span>.
        </p>
        <button onClick={reset} className="btn-primary mt-6">Submit another</button>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      <div className="card-glass p-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-white text-2xl">{form?.title}</h1>
            <p className="text-slate-500 text-sm">{form?.fields.length} question{form?.fields.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {form?.fields.map((field, i) => (
          <div key={i} className="card p-5 hover:border-slate-700 transition-colors">
            <label className="label">
              {field.label}
              {field.required && <span className="text-red-400 ml-1">*</span>}
            </label>

            {field.type === 'text' && (
              <input
                type="text"
                value={answers[field.label] ?? ''}
                onChange={e => {
                  setAnswers(a => ({ ...a, [field.label]: e.target.value }));
                  setErrors(er => ({ ...er, [field.label]: '' }));
                }}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                className={`input ${errors[field.label] ? 'border-red-500/50' : ''}`}
              />
            )}

            {field.type === 'number' && (
              <input
                type="number"
                value={answers[field.label] ?? ''}
                onChange={e => {
                  setAnswers(a => ({ ...a, [field.label]: e.target.value }));
                  setErrors(er => ({ ...er, [field.label]: '' }));
                }}
                className={`input ${errors[field.label] ? 'border-red-500/50' : ''}`}
              />
            )}

            {field.type === 'select' && (
              <div className="relative">
                <select
                  value={answers[field.label] ?? ''}
                  onChange={e => {
                    setAnswers(a => ({ ...a, [field.label]: e.target.value }));
                    setErrors(er => ({ ...er, [field.label]: '' }));
                  }}
                  className={`select pr-8 ${errors[field.label] ? 'border-red-500/50' : ''}`}
                >
                  <option value="">-- Select --</option>
                  {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            )}

            {errors[field.label] && (
              <p className="text-red-400 text-xs mt-1.5">{errors[field.label]}</p>
            )}
          </div>
        ))}

        <button type="submit" disabled={submitting} className="btn-primary w-full justify-center py-3 text-base mt-2">
          {submitting
            ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting...</>
            : 'Submit Response'}
        </button>
      </form>
    </div>
  );
}
