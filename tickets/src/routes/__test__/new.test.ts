import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";
// jest.mock('../../nats-wrapper'); cn be added to setup

it("has a route handler listening to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).not.toEqual(404);
});
it("can be accessed if the user is signed in", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).toEqual(401);
});
it("return a status other than 401 if user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({});
  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is given", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "",
      price: 10,
    })
    .expect(400);
});
it("returns an error if an invalid price is given", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "Cricket Match",
      price: -10,
    })
    .expect(400);
});
it("create a ticket with valid input", async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);
  const request_obj =  request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({
    title: 'Hii',
    price: 100,
  })
  .expect(201);
  console.log(request_obj)
  await request_obj;
  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual("Cricket Match");
  expect(tickets[0].price).toEqual(10);
});


it('publishes an event',async()=>{
  const title = 'abc-express'
  await request(app).post('/api/tickets').set('Cookie',global.signin()).send({
    title,
    price:100
  }).expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled(); //check if publish function is called

})