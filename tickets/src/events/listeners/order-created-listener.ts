import { Listener , OrderCreatedEvent, OrderStatus, Subjects} from "@sibidev/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";


export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName=queueGroupName;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        try{
            const ticket = await Ticket.findById(data.ticket.id);
             if(!ticket){
                throw new Error('Ticket not found');
             }
             ticket.set({orderId:data.id});
             ticket.save();
             await new TicketUpdatedPublisher(this.client).publish({
              id:ticket.id,
              price:ticket.price,
              title:ticket.title,
              version:ticket.version,
              orderId:ticket.orderId,
              userId:ticket.userId
             }); // from base class Listener
             msg.ack();
        }
        catch(err){
            console.log(err);
        }
  }
  

}