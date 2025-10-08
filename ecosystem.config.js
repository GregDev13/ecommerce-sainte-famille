module.exports = {
  apps: [
    {
      name: 'sainte-famille-api',
      script: './build/bin/server.js',
      cwd: '/home/deploy/ecommerce-sainte-famille/backend',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3333,
        HOST: '0.0.0.0',
      },
      error_file: '/home/deploy/logs/api-error.log',
      out_file: '/home/deploy/logs/api-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
  ],
}
