import basicAuth from 'express-basic-auth';

const user = process.env.AUTH_USER || 'admin';
const pass = process.env.AUTH_PASS || 'changeme';

export const authMiddleware = basicAuth({
  users: { [user]: pass },
  unauthorizedResponse: { error: 'Unauthorized' },
});
