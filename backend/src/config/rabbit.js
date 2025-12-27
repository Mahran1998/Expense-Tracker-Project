const amqp = require('amqplib');
const { log } = require('../utils/logger');

async function connectRabbit(retries = 5, delay = 3000) {
  while (retries > 0) {
    try {
      const conn = await amqp.connect(process.env.RABBITMQ_URL);
      log('RabbitMQ connected');
      return conn;
    } catch (err) {
      retries--;
      log(`RabbitMQ connection error: ${err.message}`);
      if (retries === 0) {
        log('RabbitMQ: exhausted retries. Exiting.');
        process.exit(1);
      }
      await new Promise(res => setTimeout(res, delay));
    }
  }
}

module.exports = { connectRabbit };

