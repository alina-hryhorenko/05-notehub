import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteNote, fetchNotes } from "../../services/noteService";
import css from "./NoteList.module.css";

interface NoteListProps {
  currentPage: number;
  onTotalPagesChange: (totalPages: number) => void;
  searchQuery: string;
}

export default function NoteList({
  currentPage,
  onTotalPagesChange,
  searchQuery,
}: NoteListProps) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", currentPage, searchQuery],
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        perPage: 12,
        search: searchQuery,
      }),
  });

  const mutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  useEffect(() => {
    if (data) {
      onTotalPagesChange(data.totalPages);
    }
  }, [data, onTotalPagesChange]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading notes</p>;

  if (!data || data.notes.length === 0) {
    return <p>No notes found</p>;
  }

  return (
    <ul className={css.list}>
      {data.notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>

          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              type="button"
              className={css.button}
              onClick={() => mutation.mutate(note.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
