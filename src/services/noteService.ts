import axios from 'axios';
import type { Note, NewNote } from '../types/note';

const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN as string | undefined;

const api = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
});

api.interceptors.request.use((config) => {
  if (TOKEN && config.headers) {
    config.headers['Authorization'] = `Bearer ${TOKEN}`;
  }
  return config;
});

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export type CreateNoteParams = NewNote;

export const fetchNotes = async (
  params: FetchNotesParams = {}
): Promise<FetchNotesResponse> => {
  const { page = 1, perPage = 12, search } = params;
  const q = new URLSearchParams();
  q.set('page', String(page));
  q.set('perPage', String(perPage));
  if (search?.trim()) q.set('search', search.trim());

  const res = await api.get<FetchNotesResponse>(`/notes?${q.toString()}`);
  return res.data;
};

export const createNote = async (data: CreateNoteParams): Promise<Note> => {
  const res = await api.post<Note>('/notes', data);
  return res.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const res = await api.delete<Note>(`/notes/${id}`);
  return res.data;
};
