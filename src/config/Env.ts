export const Env = {
  socket: { timeout: Number(process.env.SOCKET_CONNECTION_TIMEOUT) || 30000 },
  app: {
    port: process.env.APP_PORT || 3000,
  },
};
