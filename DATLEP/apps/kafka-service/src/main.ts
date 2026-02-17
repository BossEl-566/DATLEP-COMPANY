import {kafka} from "../../../packages/utils/src/kafka/index"
import { updateUserAnalytics, updateProductAnalytics } from "./service/analytics.service";


const consumer = kafka.consumer({ groupId: 'user-events-group' });

const eventQueue: any[] = [];


const processQueue = async () => {
  if (eventQueue.length === 0) return;
   
  const events = [...eventQueue];
  eventQueue.length = 0;
  
  for (const event of events) {
    if(event.action === "shop_visit"){
      // update shop analytics
    }

    const validActions = [
  "add_to_cart",
  "remove_from_cart",
  "product_view",
  "add_to_wishlist",
  "remove_from_wishlist",
  "purchase",
];
  if(!event.action || !validActions.includes(event.action)) continue;

  try {
    await updateUserAnalytics(event);
    await updateProductAnalytics(event);
  } catch (error) {
    console.log(`Error processing event: ${error}`);
  }
  
  }
  }

  setInterval(processQueue, 3000);

  // kafka consumer for user events
  export const consumerKafkaMesssages = async () => {
    // connect to kafka broker
    await consumer.connect();

    // subscribe to topic
    await consumer.subscribe({ topic: 'users-events', fromBeginning: false });

    // consume messages
    await consumer.run({
      eachMessage: async ({  message }) => {
        if(!message.value) return;
        const event = JSON.parse(message.value.toString());
        eventQueue.push(event);
      }
    });
  }

  consumerKafkaMesssages().catch(console.error);

