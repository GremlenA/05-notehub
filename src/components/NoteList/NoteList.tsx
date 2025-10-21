
import css from "./NoteList.module.css";
import type { Note } from "../../types/note";

interface Props {
  notes: Note[];
  onDelete?: (id: string) => void;
  deletingId?: string | null;
}

export default function NoteList({ notes, onDelete, deletingId }: Props) {
  if (!notes || notes.length === 0) return null;

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            {onDelete && (
              <button
                className={css.button}
                disabled={deletingId === note.id}
                onClick={() => {
                  if (confirm("Delete this note?")) onDelete(note.id);
                }}
              >
                {deletingId === note.id ? "Deleting..." : "Delete"}
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
