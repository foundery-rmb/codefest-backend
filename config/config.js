var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'codefestbackend'
    },
    port: process.env.PORT || 3000,
    db: 'sqlite://localhost/codefest-backend',
    storage: rootPath + '/data/codefest-backend'
  },

  test: {
    root: rootPath,
    app: {
      name: 'codefestbackend'
    },
    port: process.env.PORT || 3000,
    db: 'sqlite://localhost/codefestbackend-test',
    storage: rootPath + '/data/codefestbackend-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'codefestbackend'
    },
    port: process.env.PORT || 3000,
    db: 'sqlite://localhost/codefestbackend-production',
    storage: rootPath + 'data/codefestbackend-production'
  }
};

module.exports = config[env];
