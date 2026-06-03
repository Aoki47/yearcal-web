import { initDB } from '../src/db/connection';
import app from '../src/app';

let initialized = false;

export default async function handler(req: any, res: any) {
  if (!initialized) {
    await initDB();
    initialized = true;
  }
  return app(req, res);
}
