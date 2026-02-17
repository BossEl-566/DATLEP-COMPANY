import "dotenv/config";
import mongoose from "mongoose";

import { kafka } from "../../../packages/utils/src/kafka/index";
import {
  updateUserAnalytics,
  updateProductAnalytics,
} from "./service/analytics.service";

const consumer = kafka.consumer({ groupId: "user-events-group" });

const eventQueue: any[] = [];
let isProcessing = false;

async function connectDb() {
  if (mongoose.connection.readyState === 1) return; // already connected

  console.log("[DB] connecting...");
  await mongoose.connect(process.env.MONGO_URI as string, {
    serverSelectionTimeoutMS: 15000,
  });

  console.log("[DB] connected", {
    readyState: mongoose.connection.readyState,
    name: mongoose.connection.name,
    host: mongoose.connection.host,
  });
}

const validActions = new Set([
  "add_to_cart",
  "remove_from_cart",
  "product_view",
  "add_to_wishlist",
  "remove_from_wishlist",
  "purchase",
]);

const processQueue = async () => {
  if (isProcessing) return;              // prevent overlap
  if (eventQueue.length === 0) return;

  isProcessing = true;
  try {
    // Ensure DB is connected before any mongoose operation
    await connectDb();

    const events = eventQueue.splice(0, eventQueue.length);

    for (const event of events) {
      if (!event?.action || !validActions.has(event.action)) continue;

      try {
        await updateUserAnalytics(event);
        await updateProductAnalytics(event);
      } catch (error) {
        console.log("[PROCESS] Error processing event:", error);
      }
    }
  } finally {
    isProcessing = false;
  }
};

setInterval(processQueue, 3000);

export const consumerKafkaMesssages = async () => {
  await connectDb();

  await consumer.connect();
  await consumer.subscribe({ topic: "users-events", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;

      try {
        const event = JSON.parse(message.value.toString());
        eventQueue.push(event);
      } catch (e) {
        console.log("[KAFKA] Invalid JSON message:", e);
      }
    },
  });
};

// graceful shutdown
const shutdown = async () => {
  console.log("[SHUTDOWN] disconnecting...");
  try { await consumer.disconnect(); } catch {}
  try { await mongoose.disconnect(); } catch {}
  process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

consumerKafkaMesssages().catch(console.error);
