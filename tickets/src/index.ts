import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";
const start = async () => {

  if(!process.env.NATS_URL){
    throw new Error('NATS_URL is required')
  }
  if(!process.env.NATS_CLUSTER_ID){
    throw new Error('NATS_CLUSTER_ID is required')
  }
  if(!process.env.NATS_CLIENT_ID){
    throw new Error('NATS_CLIENT_ID is required')
  }
 
  mongoose
    .connect(
      "mongodb+srv://sibi:sibinandhan@cluster0.kzlct20.mongodb.net/tickets?retryWrites=true&w=majority"
    )
    .then((success) => {
      console.log("connected successfully");
      app.listen(3000, () => {
        console.log("Listening on port 3000!!!");
      });
    })
    .catch((err) => {
      console.log("ERROR", err.message);
    });
  await natsWrapper.connect(process.env.NATS_CLUSTER_ID,process.env.NATS_CLIENT_ID,process.env.NATS_URL); //ticketing should be specified in nats deployment file c-id
  new OrderCancelledListener(natsWrapper.client).listen();
  new OrderCreatedListener(natsWrapper.client).listen();
  natsWrapper.client.on('close',()=>{
     console.log('NATS Connection closed');
     process.exit();  
  });

  process.on('SIGINT',()=>natsWrapper.client.close())
  process.on('SIGTERM',()=>natsWrapper.client.close())

};

start();
