import express from "express";
import bp from "body-parser";
import fetch from "node-fetch";

import { Kafka } from "kafkajs";

const app = express();

app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());

const res = await fetch("https://www.ikea.com/us/en/data-sources/4c852290032c11eb995be32ed4ecf18b.json");
const codList = (await res.json()).products;

const kafka = new Kafka({
    clientId: "my-app",
    brokers: ["192.168.0.100:9092"]
});

const producer = kafka.producer();
console.log("Producer connecting...");
await producer.connect();
console.log("Producer connected successfully!");

app.post("/", async (req, res) => {
    try {
        console.log(req.body.topic)
        await producer.send({
            topic: req.body.topic,
            messages: [
                { value: JSON.stringify(req.body.message) },
            ],
        });
        res.status(200).send("Message sent successfully");
    } catch (err) {
        res.status(500).send(`Message sent unsuccessfully: ${err}`);
    }
});

app.listen(3000, () => {
    console.log("Express server running on port 3000");
});

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
        console.log("message: ", message)
        const sku = JSON.parse(message.value).sku.toString();
        console.log("\n==============");
        console.log("topic: ", topic);
        console.log("partition: ", partition);
        console.log({
            value: sku,
        });
        console.log("==============");

        console.log("Checking if product is CoD item...");
        try {
            if (Object.keys(codList).includes(sku)) {
                console.log(`*** ${sku} IS A COD ITEM ***`);
            } else {
                console.log(`*** ${sku } IS NOT A COD ITEM`);
            }
        } catch (err) {
            console.log(err);
        }
    },
});
console.log("Consumer read messages successfully!");
