import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getForms } from '../services/api';
import type { Form } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const typeBadge: Record<string, string> = {
  text: 'badge-blue',
  number: 'badge-green',
  select: 'badge-purple',
};

export default function AdminDashboard() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    getForms()
      .then(setForms)
      .catch(() => setError('Could not load forms. Is the server running?'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => forms.filter(f => f.title.toLowerCase().includes(search.toLowerCase())),
    [forms, search]
  );

  const copyLink = (id: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/form/${id}`);
    toast.success('Link copied!');
  };

  if (loading) return <LoadingSpinner message="Loading forms..." />;
  if (error) return <div className="text-center py-20 text-red-400">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-white">Admin Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your forms and track submissions</p>
        </div>
        <Link to="/create" className="btn-primary self-start">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Form
        </Link>
      </div>

      {/* quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <div className="stat-card">
          <p className="text-slate-500 text-xs uppercase tracking-wider">Total Forms</p>
          <p className="text-3xl font-bold text-white">{forms.length}</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-500 text-xs uppercase tracking-wider">Total Fields</p>
          <p className="text-3xl font-bold text-white">
            {forms.reduce((a, f) => a + f.fields.length, 0)}
          </p>
        </div>
        <div className="stat-card col-span-2 sm:col-span-1">
          <p className="text-slate-500 text-xs uppercase tracking-wider">Latest</p>
          <p className="text-lg font-bold text-white truncate">{forms[0]?.title ?? '—'}</p>
        </div>
      </div>

      {forms.length > 0 && (
        <div className="mb-6 max-w-sm">
          <input
            type="text"
            placeholder="Search forms..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-4"
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon="🗂️"
          title={search ? 'No matching forms' : 'No forms yet'}
          description={search ? 'Try a different term.' : 'Create your first form to get started.'}
          action={!search ? <Link to="/create" className="btn-primary">Create Form</Link> : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(form => (
            <div
              key={form._id}
              className="card p-6 flex flex-col gap-4 hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div>
                <h3 className="text-white font-semibold truncate">{form.title}</h3>
                <p className="text-slate-500 text-xs mt-1">
                  {new Date(form.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {form.fields.slice(0, 5).map((f, i) => (
                  <span key={i} className={typeBadge[f.type]}>{f.label}</span>
                ))}
                {form.fields.length > 5 && (
                  <span className="badge bg-slate-700 text-slate-400">+{form.fields.length - 5}</span>
                )}
              </div>

              <p className="text-slate-500 text-xs">{form.fields.length} field{form.fields.length !== 1 ? 's' : ''}</p>

              <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
                <div className="flex gap-2">
                  <Link to={`/form/${form._id}`} target="_blank" className="btn-secondary flex-1 justify-center">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Open
                  </Link>
                  <button onClick={() => copyLink(form._id)} className="btn-secondary px-3" title="Copy link">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                <div className="flex gap-2">
                  <Link to={`/forms/${form._id}/responses`} className="btn-ghost flex-1 justify-center">Responses</Link>
                  <Link to={`/forms/${form._id}/analytics`} className="btn-ghost flex-1 justify-center">Analytics</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
