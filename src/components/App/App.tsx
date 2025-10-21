import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import NoteList from "../NoteList/NoteList";
import type { FetchNotesResponse } from "../../services/noteService";
import { fetchNotes } from "../../services/noteService";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import { useDebounce } from "use-debounce";
import css from "./App.module.css";

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [debouncedSearch] = useDebounce(search, 500);


  const { data, isLoading, isError } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () => fetchNotes({ page, search: debouncedSearch }),
    initialData: { notes: [], totalPages: 1 },
    staleTime: 2000,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading notes</p>;

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={setSearch} />
        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      <NoteList notes={notes} deletingId={deletingId} setDeletingId={setDeletingId} />

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onCancel={() => setIsModalOpen(false)}
            onSuccess={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}
