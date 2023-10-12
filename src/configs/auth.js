export default {
  jwt: {
    secret: process.env.AUTH_SECRET || 'default-secret-key',
    expiresIn: '1d',
  },
};
