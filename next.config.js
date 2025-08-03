module.exports = {
  env: {
    TURSO_CONNECTION_URL: process.env.TURSO_CONNECTION_URL,
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
  },

  experimental: {
    turbo: {
      resolveAlias: {
        '@libsql/client': '@libsql/client/web',
      },
    },
  },
};
