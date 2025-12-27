const amqp = require('amqplib');
const { log } = require('../utils/logger');

async function connectRabbit() {
  try {
    const conn = await amqp.connect(process.env.RABBITMQ_URL);
    log('RabbitMQ connected');
    return conn;
  } catch (err) {
    log('RabbitMQ connection error:', err);
    process.exit(1);
  }
}

module.exports = { connectRabbit };

