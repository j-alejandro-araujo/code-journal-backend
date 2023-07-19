import { useState } from 'react';
import EntryForm from './EntryForm';
import EntryList from './EntryList';
import { NavBar } from './NavBar';
import { useCRUD } from './data';
import './App.css';

export default function App() {
  /* What is being currently edited:
   * undefined - nothing, display entries
   * null - creating a new entry
   * defined - the entry being edited
   */
  const [editing, setEditing] = useState();
  const crud = useCRUD();

  return (
    <>
      <NavBar onEntries={() => setEditing(undefined)} />
      {editing !== undefined && (
        <EntryForm entry={editing} onSubmit={() => setEditing(undefined)} />
      )}
      {editing === undefined && (
        <EntryList
          onCreate={() => setEditing(null)}
          onEdit={(entry) => setEditing(entry)}
          entries={crud.entries}
          loading={crud.loading}
          error={crud.error}
        />
      )}
    </>
  );
}
