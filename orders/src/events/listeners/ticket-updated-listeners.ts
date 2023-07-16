import { Message } from "node-nats-streaming";
import { Subjects,Listener,TicketUpdatedEvent } from "@sibidev/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated=Subjects.TicketUpdated;
    queueGroupName=queueGroupName;
    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        try{
            const ticket = await Ticket.findByEvent(data);
            if(!ticket){
                throw new Error('Ticket not found');
            }
            const {title,price}=data;
            ticket.set({ticket,price,title});
            await ticket.save();
            msg.ack();
        }
        catch(err){
            console.log(err);
        }
    }
}