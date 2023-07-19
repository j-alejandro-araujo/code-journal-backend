import { useState, useEffect } from 'react';

export function useCRUD() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await readEntries();
        setEntries(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const readEntries = async () => {
    try {
      const res = await fetch('/api/entries');
      if (!res.ok) {
        throw new Error('Failed to fetch entries from server.');
      }
      return await res.json();
    } catch (error) {
      setError(error);
    }
  };

  const addEntry = async (entry) => {
    try {
      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });
      if (!res.ok) {
        throw new Error('Failed to add entry to the server.');
      }
      const newEntry = await res.json();
      setEntries((prevEntries) => [newEntry, ...prevEntries]);
    } catch (error) {
      setError(error);
    }
  };

  const updateEntry = async (entryId, updatedData) => {
    try {
      const entryToUpdate = entries.find((entry) => entry.entryId === entryId);
      if (!entryToUpdate) {
        throw new Error(`Entry ID with ${entryId} not found.`);
      }

      const updatedEntry = {
        ...updatedData,
      };

      const res = await fetch(`/api/entries/${entryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEntry),
      });

      if (!res.ok) {
        throw new Error('Failed tonupdate entry on the server.');
      }

      setEntries((prevEntries) =>
        prevEntries.map((entry) =>
          entry.entryId === entryId ? updatedEntry : entry
        )
      );
    } catch (error) {
      setError(error);
    }
  };

  const deleteEntry = async (entryId) => {
    try {
      const entryToDelete = entries.find((entry) => entry.entryId === entryId);
      if (!entryToDelete) {
        throw new Error(`Entry ID with ${entryId} not found.`);
      }

      const res = await fetch(`/api/entries/${entryId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('Failed to delete the entry from the server.');
      }
      setEntries((prevEntries) =>
        prevEntries.filter((entry) => entry.entryId !== entryId)
      );
    } catch (error) {
      setError(error);
    }
  };

  return {
    entries,
    loading,
    error,
    readEntries,
    addEntry,
    updateEntry,
    deleteEntry,
  };
}
