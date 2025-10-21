import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import NoteList from "../NoteList/NoteList";
import type { FetchNotesResponse } from "../../services/noteService";
import { fetchNotes, deleteNote } from "../../services/noteService";
import SearchBox from "../SerchBox/Search";
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

  const [debouncedSearch] = useDebounce(search, 500); // <-- useDebounce для поиска

  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", page, debouncedSearch], // <-- используем debouncedSearch
    queryFn: () => fetchNotes({ page, search: debouncedSearch }),
  });

  const delMutation = useMutation({
    mutationFn: (id: string) => deleteNote({ id }),
    onMutate: (id: string) => setDeletingId(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes", page, debouncedSearch] });
      setDeletingId(null);
    },
    onError: () => setDeletingId(null),
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading notes</p>;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={setSearch} />
        {data && data.totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {data?.notes?.length ? (
        <NoteList
          notes={data.notes}
          onDelete={(id) => delMutation.mutate(id)}
          deletingId={deletingId}
        />
      ) : (
        <p>No notes found</p>
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
