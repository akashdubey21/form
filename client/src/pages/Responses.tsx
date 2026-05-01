import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getResponses } from '../services/api';
import type { Form, FormResponse } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

export default function Responses() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    getResponses(id)
      .then(data => {
        setForm(data.form);
        setResponses(data.responses);
      })
      .catch(() => setError('Failed to load responses'))
      .finally(() => setLoading(false));
  }, [id]);

  // column headers come directly from the form fields
  const cols = useMemo(() => form?.fields.map(f => f.label) ?? [], [form]);

  if (loading) return <LoadingSpinner message="Loading responses..." />;
  if (error) return <div className="text-center py-16 text-red-400">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1 text-sm">
            <Link to="/" className="text-slate-500 hover:text-slate-300 transition-colors">Dashboard</Link>
            <span className="text-slate-700">/</span>
            <span className="text-slate-300">{form?.title}</span>
            <span className="text-slate-700">/</span>
            <span className="text-brand-400 font-medium">Responses</span>
          </div>
          <h1 className="text-white">{form?.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="badge-purple text-sm px-3 py-1">
            {responses.length} response{responses.length !== 1 ? 's' : ''}
          </span>
          {id && <Link to={`/forms/${id}/analytics`} className="btn-primary">Analytics</Link>}
        </div>
      </div>

      {responses.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No responses yet"
          description="Share the form link to start collecting."
          action={<Link to={`/form/${id}`} target="_blank" className="btn-primary">Open Form</Link>}
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">#</th>
                  {cols.map(col => (
                    <th key={col} className="text-left px-4 py-3 text-slate-300 font-semibold whitespace-nowrap">{col}</th>
                  ))}
                  <th className="text-left px-4 py-3 text-slate-500 font-medium whitespace-nowrap">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {responses.map((resp, i) => (
                  <tr key={resp._id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-slate-600 font-mono text-xs">{i + 1}</td>
                    {cols.map(col => (
                      <td key={col} className="px-4 py-3 text-slate-300 max-w-[200px]">
                        <span className="block truncate">
                          {resp.answers[col] !== undefined && resp.answers[col] !== ''
                            ? String(resp.answers[col])
                            : <span className="text-slate-600 italic">—</span>}
                        </span>
                      </td>
                    ))}
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {new Date(resp.submittedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
