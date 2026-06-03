import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/connection';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const year = Number(req.query.year);
  if (!year || isNaN(year)) {
    res.status(400).json({ error: 'year query parameter is required' });
    return;
  }
  const events = db.prepare('SELECT * FROM events WHERE year = ? ORDER BY month, day').all(year);
  res.json(events);
});

router.post('/', (req: Request, res: Response) => {
  const { year, month, day, title, memo, color } = req.body;
  if (!year || !month || !title) {
    res.status(400).json({ error: 'year, month, title are required' });
    return;
  }
  const now = new Date().toISOString();
  const id = uuidv4();
  db.prepare(
    'INSERT INTO events (id, year, month, day, title, memo, color, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(id, year, month, day ?? null, title, memo ?? null, color ?? '#4CAF50', now, now);
  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(id);
  res.status(201).json(event);
});

router.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { year, month, day, title, memo, color } = req.body;
  const existing = db.prepare('SELECT * FROM events WHERE id = ?').get(id);
  if (!existing) {
    res.status(404).json({ error: 'Event not found' });
    return;
  }
  const now = new Date().toISOString();
  db.prepare(
    'UPDATE events SET year=?, month=?, day=?, title=?, memo=?, color=?, updated_at=? WHERE id=?'
  ).run(
    year ?? (existing as any).year,
    month ?? (existing as any).month,
    day !== undefined ? day : (existing as any).day,
    title ?? (existing as any).title,
    memo !== undefined ? memo : (existing as any).memo,
    color ?? (existing as any).color,
    now,
    id
  );
  const updated = db.prepare('SELECT * FROM events WHERE id = ?').get(id);
  res.json(updated);
});

router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const result = db.prepare('DELETE FROM events WHERE id = ?').run(id);
  if (result.changes === 0) {
    res.status(404).json({ error: 'Event not found' });
    return;
  }
  res.status(204).send();
});

export default router;
