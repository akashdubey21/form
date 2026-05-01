import axios from 'axios';
import type { Form, FormResponse, AnalyticsData } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export const getForms = () =>
  api.get<Form[]>('/forms').then(r => r.data);

export const getFormById = (id: string) =>
  api.get<Form>(`/forms/${id}`).then(r => r.data);

export const createForm = (data: Partial<Form>) =>
  api.post<Form>('/forms', data).then(r => r.data);

export const submitResponse = (formId: string, answers: Record<string, string | number>) =>
  api.post(`/forms/${formId}/submit`, { answers }).then(r => r.data);

export const getResponses = (formId: string): Promise<{ form: Form; responses: FormResponse[] }> =>
  api.get(`/forms/${formId}/responses`).then(r => r.data);

export const getAnalytics = (formId: string) =>
  api.get<AnalyticsData>(`/forms/${formId}/analytics`).then(r => r.data);
