// ── Field & Form types ─────────────────────────────────────────
export interface Field {
  label: string;
  type: 'text' | 'number' | 'select';
  required: boolean;
  options: string[];
}

export interface Form {
  _id: string;
  title: string;
  slug: string;
  fields: Field[];
  createdAt: string;
}

// ── Response types ─────────────────────────────────────────────
export interface FormResponse {
  _id: string;
  formId: string;
  answers: Record<string, string | number>;
  submittedAt: string;
}

// ── Analytics types ────────────────────────────────────────────
export interface SelectFieldStat {
  [option: string]: number;
}

export interface NumberFieldStat {
  average: number | null;
  count: number;
}

export type FieldStat = SelectFieldStat | NumberFieldStat;

export interface AnalyticsData {
  form: Pick<Form, '_id' | 'title' | 'fields'>;
  totalResponses: number;
  fieldStats: Record<string, FieldStat>;
}
