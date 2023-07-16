import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("return a 404 if the id does not exists", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "light",
      price: 20,
    })
    .expect(404);
});

it("return a 401 if user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "light",
      price: 20,
    })
    .expect(401);
});
it("return a 401 if the user does not own the ticket", async () => {
  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", global.signin())
    .send({
      title: "light",
      price: 20,
    });
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({
      title: "light green",
      price: 20,
    })
    .expect(401);
});
it("return a 400 if the price or title is invalid", async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", cookie)
    .send({
      title: "light",
      price: 20,
    });
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: -1,
    })
    .expect(401);
});
it("return a 200 if valid price and title is updated", async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", cookie)
    .send({
      title: "light",
      price: 20,
    });
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "light house",
      price: 30,
    })
    .expect(200);
});
