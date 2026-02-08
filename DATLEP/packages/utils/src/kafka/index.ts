import { Kafka } from "kafkajs";

export const kafka = new Kafka({
    clientId: 'kafka-service',
    brokers: ['pkc-921jm.us-east-2.aws.confluent.cloud:9092'],
    ssl: true,
    sasl: {
        mechanism: 'plain',
        username: process.env.KAFKA_API_KEY!,
        password: process.env.KAFKA_API_SECRET!,
    }
});

async function testConnection() {
  const admin = kafka.admin();
  try {
    await admin.connect();
    console.log('Connected to Kafka successfully!');
  } catch (err) {
    console.error('Failed to connect:', err);
  } finally {
    await admin.disconnect();
  }
}

testConnection();
