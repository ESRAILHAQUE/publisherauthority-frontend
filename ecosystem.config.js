module.exports = {
  apps: [{
    name: 'publisherauthority-frontend',
    script: 'npm',
    args: 'start',
    instances: 1,
    exec_mode: 'fork',  // Changed from 'cluster' to 'fork' for lower CPU usage
    max_memory_restart: '800M',  // Auto-restart if memory exceeds 800MB (increased to prevent OOM kills)
    min_uptime: '10s',  // Minimum uptime before considering app stable
    max_restarts: 10,  // Maximum restarts in 1 minute
    restart_delay: 4000,  // Delay between restarts (4 seconds)
    kill_timeout: 5000,  // Graceful shutdown timeout
    listen_timeout: 10000,  // Wait for app to listen
    env: {
      NODE_ENV: 'production',
      PORT: 3003
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_file: './logs/pm2-combined.log',
    time: true,
    merge_logs: true,
    autorestart: true
  }]
};

