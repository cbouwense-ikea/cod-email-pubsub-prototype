import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: "my-app",
    brokers: ["192.168.0.100:9092"]
});

const producer = kafka.producer();

console.log("Producer connecting...");
await producer.connect();
console.log("Producer connected successfully!");
await producer.send({
    topic: "test-topic",
    messages: [
        { value: "New message" },
    ],
});

await producer.disconnect();

const consumer = kafka.consumer({ groupId: "test-group" });

console.log("Consumer connecting...");
await consumer.connect();
console.log("Consumer connected successfully!");
console.log("Consumer subscribing...");
await consumer.subscribe({ 
    topic: "test-topic",
    fromBeginning: true
});
console.log("Consumer subscribed successfully!");

console.log("Consumer awaiting messages...");
await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
        console.log("\n==============");
        console.log("topic: ", topic);
        console.log("partition: ", partition);
        console.log({
            value: message.value.toString(),
        });
        console.log("==============\n");
    },
});
console.log("Consumer read messages successfully!");