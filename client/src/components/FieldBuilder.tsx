import type { Field } from '../types';

interface FieldBuilderProps {
  field: Field;
  index: number;
  onChange: (index: number, updated: Field) => void;
  onRemove: (index: number) => void;
}

const FieldBuilder = ({ field, index, onChange, onRemove }: FieldBuilderProps) => {
  const update = (patch: Partial<Field>) => onChange(index, { ...field, ...patch });

  const addOption = () => update({ options: [...field.options, ''] });

  const updateOption = (optIdx: number, value: string) => {
    const opts = [...field.options];
    opts[optIdx] = value;
    update({ options: opts });
  };

  const removeOption = (optIdx: number) =>
    update({ options: field.options.filter((_, i) => i !== optIdx) });

  const typeColors: Record<string, string> = {
    text: 'badge-blue',
    number: 'badge-green',
    select: 'badge-purple',
  };

  return (
    <div className="card p-5 flex flex-col gap-4 animate-slide-up group hover:border-slate-700 transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
            {index + 1}
          </div>
          <span className={typeColors[field.type]}>{field.type}</span>
        </div>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="btn-danger opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Remove
        </button>
      </div>

      {/* Label + Type + Required */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-1">
          <label className="label">Field Label</label>
          <input
            type="text"
            value={field.label}
            onChange={(e) => update({ label: e.target.value })}
            placeholder="e.g. Full Name"
            className="input"
          />
        </div>

        <div>
          <label className="label">Type</label>
          <div className="relative">
            <select
              value={field.type}
              onChange={(e) => update({ type: e.target.value as Field['type'], options: [] })}
              className="select pr-8"
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="select">Select</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-end">
          <label className="flex items-center gap-2.5 cursor-pointer group/toggle mt-auto pb-2.5">
            <div
              onClick={() => update({ required: !field.required })}
              className={`w-10 h-5 rounded-full transition-all duration-300 relative cursor-pointer flex-shrink-0 ${
                field.required ? 'bg-brand-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${
                  field.required ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
            <span className="text-sm font-medium text-slate-300">Required</span>
          </label>
        </div>
      </div>

      {/* Options for select */}
      {field.type === 'select' && (
        <div className="flex flex-col gap-2 pt-1 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <label className="label mb-0">Options</label>
            <button type="button" onClick={addOption} className="btn-ghost text-xs py-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add option
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {field.options.map((opt, oi) => (
              <div key={oi} className="flex items-center gap-2">
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => updateOption(oi, e.target.value)}
                  placeholder={`Option ${oi + 1}`}
                  className="input flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeOption(oi)}
                  className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            {field.options.length === 0 && (
              <p className="text-xs text-slate-600 italic">No options yet — click "Add option"</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldBuilder;
