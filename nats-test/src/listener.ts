import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from "./events/ticket-created-listener";
console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  stan.on("close", () => {
    console.log("NATS CONNECTION CLOSE");
    process.exit();
  });
   new TicketCreatedListener(stan).listen();
   // below code replaced by above
  // const options = stan
  //   .subscriptionOptions()
  //   .setManualAckMode(true) // ack ->acknowledgement (if something happens in service , gives and acknowledgement) tries after each 30 seconds , till we manually sen acknowlegment
  //   .setDeliverAllAvailable() // returns all the events received to this channel;
  //   .setDurableName("accounting-service"); // Durable subscription (only for first time when servie starts , it brings all the events and then marks with id , an set it as processed , once service goes to offine and come back , it gets everything which is unprocess and saves it to service)
  // const subscription = stan.subscribe(
  //   "ticket:created", //name of channel
  //   "order-service-queue-group", //queue group , multiple instance does not receive the same data (message) if there are two instance of same service
  //   options
  // );
  // subscription.on("message", (msg: Message) => {
  //   const data = msg.getData();
  //   if (typeof data == "string") {
  //     console.log(
  //       `RECEIVE EVENT NUMBER ${msg.getSequence()} , with data: ${data}`
  //     );
  //   }
  //   msg.ack(); // this is the acknowledgement -> setManualAckMode
  // });
});
//check subscription in monitor port   // hbi , hbt , hbf (heart beat)
//http://localhost:8222/streaming/channelsz?subs=1

process.on("SIGINT", () => stan.close()); // interup signals

process.on("SIGTERM", () => stan.close()); //terminate signals




