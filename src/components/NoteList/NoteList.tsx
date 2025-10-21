import { useMutation, useQueryClient } from "@tanstack/react-query";
import css from "./NoteList.module.css";
import type { Note } from "../../types/note";
import { deleteNote } from "../../services/noteService";

interface NoteListProps {
  notes: Note[];
  deletingId?: string | null;
  setDeletingId: (id: string | null) => void;
}

export default function NoteList({ notes, deletingId, setDeletingId }: NoteListProps) {
  const qc = useQueryClient();

  const delMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onMutate: (id: string) => setDeletingId(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes"] });
      setDeletingId(null);
    },
    onError: () => setDeletingId(null),
  });

  if (!notes || notes.length === 0) return <p>No notes found</p>;

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              disabled={deletingId === note.id || delMutation.status === "pending"}
              onClick={() => {
                if (confirm("Delete this note?")) delMutation.mutate(note.id);
              }}
            >
              {deletingId === note.id || delMutation.status === "pending"
                ? "Deleting..."
                : "Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
