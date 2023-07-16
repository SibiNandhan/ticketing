import express, { Request, Response } from "express";
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from "@sibidev/common";
import { body } from "express-validator";
import mongoose from "mongoose";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { OrderCreatedPublisher } from "../events/publisher/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";



const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15*60;

router.post(
  "/api/orders",
  body("ticketId")
    .not()
    .isEmpty()
    .custom((input: string) => {
      return mongoose.Types.ObjectId.isValid(input);
    })
    .withMessage("TicketId must be provided"),
  validateRequest,
  async (req: Request, res: Response) => {
    const {ticketId} = req.body;
    const ticket = await Ticket.findById(ticketId);
    //check if ticket exists
    if(!ticket){
        throw new NotFoundError();
    }
    //check if ticket is reserved or booked
    //check if order is reserved
    const isReserved = await ticket.isReserved();
    if(isReserved){
        throw new BadRequestError('Ticket is already reserved');
    }
    //set expiration date

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + (EXPIRATION_WINDOW_SECONDS));

    const order = await Order.build({
      userId:req.currentUser!.id,
      status:OrderStatus.Created,
      expiresAt:expiration,
      ticket
    });
    await order.save();
     new OrderCreatedPublisher(natsWrapper.client).publish({
      id:order.id,
      status:order.status,
      userId:order.userId,
      expiresAt:order.expiresAt.toISOString(),
      version:ticket.version,
      ticket:{
        id:ticket.id,
        price:ticket.price
      }
     })

    res.status(200).send(order);
  }
);

export { router as newOrderRouter };
