import express from "express";
import bp from "body-parser";

import { startConsumer } from "./consumer.js";
import { produce, startProducer } from "./producer.js";

const app = express();

app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());

await startProducer();
await startConsumer();

app.post("/", async (req, res) => {
    try {
        produce(req);
        res.status(200).send("Message sent successfully");
    } catch (err) {
        res.status(500).send(`Message sent unsuccessfully: ${err}`);
    }
});

app.listen(3000, () => {
    console.log("Express server running on port 3000");
});
