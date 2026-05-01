import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getAnalytics } from '../services/api';
import type { AnalyticsData, SelectFieldStat, NumberFieldStat } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#4f46e5', '#4338ca'];

// type guard - number stats have an 'average' key
const isNumberStat = (s: unknown): s is NumberFieldStat =>
  typeof s === 'object' && s !== null && 'average' in s;

export default function Analytics() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    getAnalytics(id)
      .then(setData)
      .catch(() => setError('Failed to load analytics'))
      .finally(() => setLoading(false));
  }, [id]);

  const selectFields = useMemo(() => data?.form.fields.filter(f => f.type === 'select') ?? [], [data]);
  const numberFields = useMemo(() => data?.form.fields.filter(f => f.type === 'number') ?? [], [data]);

  if (loading) return <LoadingSpinner message="Computing analytics..." />;
  if (error) return <div className="text-center py-16 text-red-400">{error}</div>;
  if (!data) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1 text-sm">
            <Link to="/" className="text-slate-500 hover:text-slate-300 transition-colors">Dashboard</Link>
            <span className="text-slate-700">/</span>
            <span className="text-slate-300">{data.form.title}</span>
            <span className="text-slate-700">/</span>
            <span className="text-brand-400 font-medium">Analytics</span>
          </div>
          <h1 className="text-white">{data.form.title}</h1>
          <p className="text-slate-400 text-sm mt-1">Response analytics</p>
        </div>
        <Link to={`/forms/${id}/responses`} className="btn-secondary self-start">View Responses</Link>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <div className="stat-card col-span-2 sm:col-span-1">
          <p className="text-slate-500 text-xs uppercase tracking-wider">Responses</p>
          <p className="text-4xl font-bold text-white">{data.totalResponses}</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-500 text-xs uppercase tracking-wider">Select Fields</p>
          <p className="text-4xl font-bold text-brand-400">{selectFields.length}</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-500 text-xs uppercase tracking-wider">Number Fields</p>
          <p className="text-4xl font-bold text-emerald-400">{numberFields.length}</p>
        </div>
        <div className="stat-card">
          <p className="text-slate-500 text-xs uppercase tracking-wider">Total Fields</p>
          <p className="text-4xl font-bold text-sky-400">{data.form.fields.length}</p>
        </div>
      </div>

      {data.totalResponses === 0 ? (
        <EmptyState
          icon="📊"
          title="No responses yet"
          description="Analytics will show up once people submit the form."
          action={<Link to={`/form/${id}`} target="_blank" className="btn-primary">Open Form</Link>}
        />
      ) : (
        <div className="flex flex-col gap-8">
          {numberFields.length > 0 && (
            <section>
              <h2 className="text-slate-200 mb-4">Averages</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {numberFields.map(field => {
                  const stat = data.fieldStats[field.label];
                  if (!isNumberStat(stat)) return null;
                  return (
                    <div key={field.label} className="card p-6 flex flex-col gap-3">
                      <p className="text-slate-400 text-sm">{field.label}</p>
                      <div className="flex items-end gap-2">
                        <span className="text-5xl font-bold text-emerald-400">
                          {stat.average ?? '—'}
                        </span>
                        <span className="text-slate-500 text-sm mb-2">avg</span>
                      </div>
                      <p className="text-slate-600 text-xs">{stat.count} values</p>
                      {stat.average !== null && (
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
                            style={{ width: `${Math.min((stat.average / 100) * 100, 100)}%` }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {selectFields.length > 0 && (
            <section>
              <h2 className="text-slate-200 mb-4">Distributions</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {selectFields.map(field => {
                  const stat = data.fieldStats[field.label] as SelectFieldStat;
                  if (!stat) return null;

                  const chartData = Object.entries(stat).map(([name, value]) => ({ name, value }));
                  const total = chartData.reduce((s, d) => s + d.value, 0);

                  return (
                    <div key={field.label} className="card p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-slate-200">{field.label}</h3>
                        <span className="badge-purple">{total} responses</span>
                      </div>

                      {total === 0 ? (
                        <p className="text-slate-600 text-sm italic text-center py-8">No data</p>
                      ) : (
                        <>
                          <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
                              <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                              <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#e2e8f0', fontSize: '13px' }}
                                cursor={{ fill: 'rgba(99,102,241,0.08)' }}
                              />
                              <Bar dataKey="value" name="Responses" radius={[6, 6, 0, 0]}>
                                {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>

                          <div className="mt-3 flex flex-wrap gap-2">
                            {chartData.map((d, i) => (
                              <div key={d.name} className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                <span className="text-slate-400 text-xs">
                                  {d.name}: <span className="text-slate-200 font-semibold">{d.value}</span>
                                  <span className="text-slate-600 ml-1">({total > 0 ? Math.round((d.value / total) * 100) : 0}%)</span>
                                </span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
