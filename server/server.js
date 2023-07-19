/* eslint-disable no-unused-vars -- Remove me */
import 'dotenv/config';
import pg from 'pg';
import express from 'express';

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();
app.use(express.json());

// GET ENTRIES FROM DATABASE
app.get('/api/entries', async (req, res) => {
  try {
    const sql = `
    SELECT *
    FROM "entries"
    `;
    const response = await db.query(sql);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error has occurred.' });
  }
});

// POST ENTRY TO DATABASE
app.post('/api/entries', async (req, res) => {
  try {
    const { title, photoUrl, notes } = req.body;
    if (!title || !photoUrl || !notes) {
      res
        .status(400)
        .json({
          error:
            'Invalid information, requires: Title[title], photoUrl[photoUrl], and Notes[notes].',
        });
    }
    const sql = `
    INSERT INTO "entries" ("title", "photoUrl", "notes")
    VALUES ($1, $2, $3)
    Returning *
    `;

    const params = [title, photoUrl, notes];
    const results = await db.query(sql, params);
    const newEntry = results.rows[0];
    res.status(201).json(newEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error has occurred.' });
  }
});

// UPDATING ENTRY IN DATABASE
app.put('/api/entries/:entryId', async (req, res) => {
  try {
    const { entryId } = req.params;
    const { title, photoUrl, notes } = req.body;
    if (!Number.isInteger(Number(entryId))) {
      res.status(400).json({ error: 'Invalid entryId' });
      return;
    }

    const sql = `
    UPDATE "entries"
    SET "title" = $1,
        "photoUrl" = $2,
        "notes" = $3
    WHERE "entryId" = $4
    RETURNING *
    `;
    const updatedParams = [title, photoUrl, notes, entryId];
    const updateResult = await db.query(sql, updatedParams);

    if (updatedParams.rows[0] === undefined) {
      res.status(404).json({ error: `EntryId ${entryId} not found.` });
      return;
    }

    const updatedEntry = updateResult.row[0];
    res.status(200).json(updatedEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error has occurred.' });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`express server listening on port ${process.env.PORT}`);
});
