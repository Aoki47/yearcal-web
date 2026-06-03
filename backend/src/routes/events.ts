import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../db/connection';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const year = Number(req.query.year);
  if (!year || isNaN(year)) {
    res.status(400).json({ error: 'year query parameter is required' });
    return;
  }
  const result = await pool.query(
    'SELECT * FROM events WHERE year = $1 ORDER BY month, day',
    [year]
  );
  res.json(result.rows);
});

router.post('/', async (req: Request, res: Response) => {
  const { year, month, day, title, memo, color } = req.body;
  if (!year || !month || !title) {
    res.status(400).json({ error: 'year, month, title are required' });
    return;
  }
  const now = new Date().toISOString();
  const id = uuidv4();
  const result = await pool.query(
    `INSERT INTO events (id, year, month, day, title, memo, color, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [id, year, month, day ?? null, title, memo ?? null, color ?? '#4CAF50', now, now]
  );
  res.status(201).json(result.rows[0]);
});

router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const existing = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
  if (existing.rows.length === 0) {
    res.status(404).json({ error: 'Event not found' });
    return;
  }
  const e = existing.rows[0];
  const { year, month, day, title, memo, color } = req.body;
  const now = new Date().toISOString();
  const result = await pool.query(
    `UPDATE events SET year=$1, month=$2, day=$3, title=$4, memo=$5, color=$6, updated_at=$7
     WHERE id=$8 RETURNING *`,
    [
      year ?? e.year,
      month ?? e.month,
      day !== undefined ? day : e.day,
      title ?? e.title,
      memo !== undefined ? memo : e.memo,
      color ?? e.color,
      now,
      id,
    ]
  );
  res.json(result.rows[0]);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const result = await pool.query('DELETE FROM events WHERE id = $1', [req.params.id]);
  if (result.rowCount === 0) {
    res.status(404).json({ error: 'Event not found' });
    return;
  }
  res.status(204).send();
});

export default router;
