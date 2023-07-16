import { Listener } from "./base-listeners";
import { Message } from "node-nats-streaming";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subjects";

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    subject:Subjects.TicketCreated= Subjects.TicketCreated; //type provied because , typescript is afride that we might change the type again , below.So that we cannot change it.
    queueGroupName='payment-service';

    onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
      console.log('Event Data!',data.id);
      msg.ack();
    }

}