module.exports = {
  apps: [
    {
      name: 'server',
      script: './server.js',
      env: {
        DB_URL: process.env.DB_URL,
      },
      env_production: {
        NODE_ENV: 'production',
        DB_URL: process.env.DB_URL,
      },
    },
  ],
};
