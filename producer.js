import { kafka } from "./kafkaInit.js";

const producer = kafka.producer();

const setUpProducer = async (producer) => { await producer.connect(); }

export const startProducer = async () => {
    await setUpProducer(producer);
}

export const produce = async (req) => {
    await producer.send({
        topic: req.body.topic,
        messages: [
            { value: JSON.stringify(req.body.message) },
        ],
    });
}