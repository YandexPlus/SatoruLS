// Импортируем конфигурацию базы данных
const config = require('./config/database');

module.exports = {
  development: config,
  production: config,
  // Можно добавить другие окружения если нужно
  // staging: { ... },
  // test: { ... }
}; 