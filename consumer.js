import fetch from "node-fetch";

import { kafka } from "./kafkaInit.js";

const consumer = kafka.consumer({ groupId: "test-group" });

process.on('SIGINT', () => {
    try { 
        consumer.disconnect();
    } catch (err) {
        console.error(err);
    }
    process.exit();
});

const fetchCodList = async () => {
    const res = await fetch("https://www.ikea.com/us/en/data-sources/4c852290032c11eb995be32ed4ecf18b.json");
    return (await res.json()).products;
}

const setUpConsumer = async (consumer) => {
    try {
        await consumer.connect();
        await consumer.subscribe({ 
            topic: "test-topic",
            fromBeginning: true
        });
    } catch (err) {
        console.error(err);
    }
}

const consume = async (consumer, codList) => {
    try {
        await consumer.run({
            eachMessage: async ({ _topic, _partition, message }) => {
                const payload = JSON.parse(message.value)
                const sku = payload.sku.toString();
                try {
                    if (Object.keys(codList).includes(sku)) {
                        console.log(`${payload.title.toString()} is a CoD product.`);
                        // TODO: Publish to Firestore
                    } else {
                        console.log(`${payload.title.toString()} is not a CoD product.`);
                    }
                } catch (err) {
                    console.log(err);
                }
            },
        });
    } catch (err) {
        console.error(err);
    }
};

export const startConsumer = async () => {
    console.log("fetching cod list...")
    const codList = await fetchCodList();
    console.log("setting up consumer...")
    await setUpConsumer(consumer);
    console.log("beginning to consume...")
    await consume(consumer, codList);
}