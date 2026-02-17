import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: "kafka-service",
  brokers: ["pkc-921jm.us-east-2.aws.confluent.cloud:9092"],
  ssl: {
    rejectUnauthorized: true,
    servername: "pkc-921jm.us-east-2.aws.confluent.cloud",
  },
  sasl: {
    mechanism: "plain",
    username: process.env.KAFKA_API_KEY!,
    password: process.env.KAFKA_API_SECRET!,
  },
});



