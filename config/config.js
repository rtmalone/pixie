var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    twilioSid: process.env.TWILIO_SID,
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
    root: rootPath,
    app: {
      name: 'pixie'
    },
    port: 3000,
    db: 'mongodb://localhost/pixie-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'pixie'
    },
    port: 3000,
    db: 'mongodb://localhost/pixie-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'pixie'
    },
    port: 3000,
    db: 'mongodb://localhost/pixie-production'
  }
};

module.exports = config[env];
