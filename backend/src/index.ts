import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { initDB } from './db/connection';

const PORT = process.env.PORT || 3001;

initDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Failed to initialize DB:', err);
    process.exit(1);
  });
