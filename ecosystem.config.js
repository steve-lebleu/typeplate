// Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
module.exports = {
  apps : [{
    name: 'API',
    script: './api/app.bootstrap.js',
    args: 'one two',
    exec_mode: 'cluster',
    instances: -1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_staging: {
      NODE_ENV: 'staging'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],
  deploy : {
    staging : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      ssh_options: ['StrictHostKeyChecking=no', 'PasswordAuthentication=yes', 'ForwardAgent=yes'],
      path : '/var/www/staging',
        'post-setup' : 'npm run kickstart:staging && pm2 reload ecosystem.config.js --env staging',
        'post-deploy' : 'npm i && tsc && pm2 reload ecosystem.config.js --env staging'
    },
    production : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      ssh_options: ['StrictHostKeyChecking=no', 'PasswordAuthentication=yes', 'ForwardAgent=yes'],
      path : '/var/www/production',
        'post-setup' : 'npm run kickstart:production && pm2 reload ecosystem.config.js --env production',
        'post-deploy' : 'npm i && tsc && pm2 reload ecosystem.config.js --env production'
    }
  }
};