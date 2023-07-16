import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@sibidev/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { TicketCreatedPublisher } from "../events/publisher/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .not()
      .isEmpty()
      .withMessage("Title is required")
      .isFloat({
        gt: 0,
      })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,

  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ticket = await Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });
    await ticket.save();
    new TicketCreatedPublisher(natsWrapper.client).publish({   //only client because , it is a getter
      id:ticket.id,
      price:ticket.price,
      title:ticket.title,
      userId:ticket.userId,
      version:ticket.version
    })
    res.status(201).send(ticket);
  }
);

export { router as CreateTicketRouter };
