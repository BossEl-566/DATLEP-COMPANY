"use server";

import { kafka } from "@datlep/utils";

const producer = kafka.producer();
let isConnected = false;
let connecting: Promise<void> | null = null;

async function ensureConnected() {
  if (isConnected) return;
  if (!connecting) {
    connecting = producer.connect().then(() => {
      isConnected = true;
    }).finally(() => {
      connecting = null;
    });
  }
  await connecting;
}

export async function sendKafkaEvent(eventData: {
  userId: string;
  action: string;
  productId: string;
  shopId: string;
  device: string;
  country: string;
  city: string;
}) {
  try {
    await ensureConnected();

    await producer.send({
      topic: "users-events",
      messages: [{ value: JSON.stringify(eventData) }],
    });

    return { ok: true };
  } catch (error) {
    console.error("sendKafkaEvent error:", error);
    return { ok: false };
  }
}
