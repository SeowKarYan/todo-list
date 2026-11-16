const path = require('path');

module.exports = {
  config: path.resolve('src', 'config', 'config.cjs'),
  'models-path': path.resolve('src', 'model'),
  'seeders-path': path.resolve('src', 'seeder'),
  'migrations-path': path.resolve('src', 'migration'),
};