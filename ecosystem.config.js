module.exports = {
  apps: [{
    name: 'publisherauthority-frontend',
    script: 'npm',
    args: 'start',
    instances: 1,
    exec_mode: 'fork',  // Changed from 'cluster' to 'fork' for lower CPU usage
    max_memory_restart: '800M',  // Auto-restart if memory exceeds 800MB (increased to prevent OOM kills)
    env: {
      NODE_ENV: 'production',
      PORT: 3003
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_file: './logs/pm2-combined.log',
    time: true
  }]
};

