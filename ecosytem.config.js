'use strict';

module.exports = {
  apps : [{
    name: 'apigamerloop',
    script: './bin/www_ssl',
    instances: 1,
    autorestart: true,
    watch: true,
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  },
  {
    name: 'thumbnailService',
    script: './services/thumbnailService.js',
    instances: 1,
    autorestart: true,
    watch: true,

    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]

}