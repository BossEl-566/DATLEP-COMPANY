"use server";

import { kafka } from "@datlep/utils";


const producer = kafka.producer();

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
    await producer.connect();
    await producer.send({
      topic: "users-events",
      messages: [
        {
          value: JSON.stringify(eventData),
        },
      ],
    });
  } catch (error) {
    console.log(error);
  } finally {
    await producer.disconnect();
  }
}
 