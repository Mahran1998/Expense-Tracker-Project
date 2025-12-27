const { createClient } = require('redis');
const { log } = require('../utils/logger');

function connectRedis() {
  const client = createClient({ url: process.env.REDIS_URL });
  client.on('error', err => log('Redis error:', err));
  client.connect()
    .then(() => log('Redis connected'))
    .catch(err => {
      log('Redis connection error:', err);
      process.exit(1);
    });
  return client;
}

module.exports = { connectRedis };

