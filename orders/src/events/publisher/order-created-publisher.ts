import { OrderCreatedEvent, Publisher, Subjects } from "@sibidev/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}