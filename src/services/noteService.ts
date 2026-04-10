import axios from "axios";
import type { Note, NoteTag } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api";
const token = import.meta.env.VITE_NOTEHUB_TOKEN;

const noteHubApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: NoteTag;
}

export async function fetchNotes(
  params: FetchNotesParams,
): Promise<FetchNotesResponse> {
  const response = await noteHubApi.get<FetchNotesResponse>("/notes", {
    params,
  });

  return response.data;
}

export async function createNote(noteData: CreateNoteParams): Promise<Note> {
  const response = await noteHubApi.post<Note>("/notes", noteData);
  return response.data;
}

export async function deleteNote(noteId: string): Promise<Note> {
  const response = await noteHubApi.delete<Note>(`/notes/${noteId}`);
  return response.data;
}
