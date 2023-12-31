import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('fetches the order',async()=>{
    const ticket = Ticket.build({
        title:'concert',
        price:100
    });
    await ticket.save();
    const user = global.signin()

    const {body:order}=await request(app).post('/api/orders').set('Cookie',user).send({ticketId:ticket.id}).expect(201);

    //fetch
    const {body:fetchOrder}=await request(app).get(`/api/orders/${order.id}`).set('Cookie',user).send().expect(200);
    expect(fetchOrder.id).toEqual(order.id);
})

it('returns an error , if user fetches other user orders',async()=>{
    const ticket = Ticket.build({
        title:'concert',
        price:100
    });
    await ticket.save();
    const user = global.signin()

    const {body:order}=await request(app).post('/api/orders').set('Cookie',user).send({ticketId:ticket.id}).expect(201);

    //fetch
    const {body:fetchOrder}=await request(app).get(`/api/orders/${order.id}`).set('Cookie',global.signin()).send().expect(401);
    expect(fetchOrder.id).toEqual(order.id);
})