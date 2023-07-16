import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { TicketCreatedListeners } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listeners";
import morgan from 'morgan';
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
  
  app.use(morgan('tiny'));
  mongoose
    .connect(
      "mongodb+srv://sibi:sibinandhan@cluster0.dbi8qcr.mongodb.net/orders?retryWrites=true&w=majority"
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
  natsWrapper.client.on('close',()=>{
     console.log('NATS Connection closed');
     process.exit();  
  })
  new TicketCreatedListeners(natsWrapper.client).listen();
  new TicketUpdatedListener(natsWrapper.client).listen();
  process.on('SIGINT',()=>{
    console.log('SIGINT');
    natsWrapper.client.close()
  })
  process.on('SIGTERM',()=>{
    console.log('SIGTERM');
    natsWrapper.client.close()
  })

};

start();
