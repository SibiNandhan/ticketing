import { Publisher,Subjects,TicketCreatedEvent, TicketUpdatedEvent } from "@sibidev/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated=Subjects.TicketUpdated;
}