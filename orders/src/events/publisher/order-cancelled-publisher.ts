import { Publisher,Subjects,OrderCancelledEvent } from "@sibidev/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled=Subjects.OrderCancelled
}