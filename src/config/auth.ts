export default {
  jwt: {
    secret: process.env.SECRET || 'secret',
    expiresIn: '30d',
  },
};
