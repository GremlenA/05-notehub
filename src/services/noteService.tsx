import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import type { Note, NewNote } from '../types/note';

const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN as string | undefined;

const api = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
});


api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (TOKEN) {
    config.headers.set('Authorization', `Bearer ${TOKEN}`);
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
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export type CreateNoteParams = NewNote;

export interface CreateNoteResponse {
  note: Note;
}

export interface DeleteNoteParams {
  id: string;
}

export interface DeleteNoteResponse {
  note: Note;
}

export interface UpdateNoteParams {
  id: string;
  data: Partial<NewNote>;
}

export interface UpdateNoteResponse {
  note: Note;
}

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

export const createNote = async (
  data: CreateNoteParams
): Promise<CreateNoteResponse> => {
  const res = await api.post<CreateNoteResponse>('/notes', data);
  return res.data;
};

export const deleteNote = async (
  params: DeleteNoteParams
): Promise<DeleteNoteResponse> => {
  const res = await api.delete<DeleteNoteResponse>(`/notes/${params.id}`);
  return res.data;
};

export const getNoteById = async (id: string): Promise<{ note: Note }> => {
  const res = await api.get<{ note: Note }>(`/notes/${id}`);
  return res.data;
};

export const updateNote = async (
  params: UpdateNoteParams
): Promise<UpdateNoteResponse> => {
  const { id, data } = params;
  const res = await api.patch<UpdateNoteResponse>(`/notes/${id}`, data);
  return res.data;
};
