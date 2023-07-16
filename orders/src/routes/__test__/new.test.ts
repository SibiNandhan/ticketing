import request from 'supertest';
import {app} from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { OrderStatus } from '@sibidev/common';
import { natsWrapper } from '../../nats-wrapper';


it('returns an error if the ticket ddoes not exists',async()=>{
   const ticketId = new mongoose.Types.ObjectId();

   await request(app).post('/api/orders').set('Cookie',global.signin()).send({ticketId}).expect(404);
});

it('return an error if the ticket is already reserved',async()=>{
    const ticket = Ticket.build({
        price:100,
        title:'Ani Concert'
    });
    await ticket.save();
    const order = await Order.build({
        ticket,
        userId:'123',
        status:OrderStatus.Created,
        expiresAt:new Date()
    });
    await order.save();

    await request(app).post('/api/orders').set('Cookie',global.signin()).send({
        ticketId:ticket.id
    }).expect(400)
})

it('reserves a ticket',async()=>{
    const ticket = Ticket.build({
        price:100,
        title:'Ani Concert'
    });
    await ticket.save();
    console.log(ticket.id);
    await request(app).post('/api/orders').set('Cookie',global.signin()).send({
        ticketId:ticket.id
    }).expect(201)
})

it('publish an event',async()=>{
    const ticket = Ticket.build({
        price:100,
        title:'Ani Concert'
    });
    await ticket.save();
    console.log(ticket.id);
    await request(app).post('/api/orders').set('Cookie',global.signin()).send({
        ticketId:ticket.id
    }).expect(201)

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})