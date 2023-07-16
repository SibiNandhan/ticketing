import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

const buildTicket = async()=>{
    const ticket = Ticket.build({
        title:'concert',
        price:20
    });
    await ticket.save();
    return ticket
}

it('fetches ordes for n particular user',async()=>{
    const ticketOne = await buildTicket()
    const ticketTwo = await buildTicket()
    const ticketThree = await buildTicket()

    const userOne = global.signin();
    const userTwo = global.signin();
//user 1
    await request(app).post('/api/orders').set('Cookie',userOne).send({ticketId:ticketOne.id}).expect(201);

//user 2
    await request(app).post('/api/orders').set('Cookie',userTwo).send({ticketId:ticketTwo.id}).expect(201);
    await request(app).post('/api/orders').set('Cookie',userTwo).send({ticketId:ticketThree.id}).expect(201);
    
    const response = await request(app).get('/api/orders').set('Cookie',userTwo).expect(200);
    
    expect(response.body.length).toEqual(2);

})