# CoD Email PubSub Prototype

CoD Email PubSub Prototype is an Express server which can produce and consume messages to and from a Kafka broker. Though the real service would only consume from Kafka, this demo can send messages to a Kafka queue resembling the one to which SOIM publishes. By doing this, we can easily see how a nodejs service can consume these, check if a transaction contains a CoD product, and publish to a Firestore instance resembling the one in the GCP CoD Email pipeline.

## Installation

Clone the repository to your local machine.

```bash
git clone https://github.com/cbouwense-ikea/cod-email-pubsub-prototype
cd cod-email-pubsub-prototype
```

Run the service with docker-compose
```bash
docker-compose up -d
```

## Usage

Send POST HTTP requests to http://localhost:3000/ with the following body schema
```json
{
    "topic": "test-topic",
    "message": {
        "country_code": "us",
        "first_name": "Christian",
        "last_name": "Bouwense",
        "email": "email@example.com",
        "sku": "10360474",
        "title": "CoD Product"
    }
}
```

The Docker container running the Express server will print to STDOUT whether the product is a chest of drawers or not.

## Notes
- Currently the server only responds with whether the product is a CoD or not, and doesn't publish to a mock Firestore instance.
