// ecosystem.config.js

module.exports = {
    apps: [
      {
        name: 'rentfax-backend',
        script: 'server.js',
        instances: 1, // 1 instance for now (you can scale later)
        autorestart: true,
        watch: false, // Set to true ONLY if you want auto-reload in dev
        max_memory_restart: '500M', // Restart if memory usage > 500MB
        env: {
          NODE_ENV: 'development',
          PORT: 5050,
        },
        env_production: {
          NODE_ENV: 'production',
          PORT: 5050,
        },
      },
    ],
  };
  