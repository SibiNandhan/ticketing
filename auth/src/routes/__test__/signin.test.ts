import request from "supertest";
import { app } from "../../app";

it("fails if email does not exists", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "sibi@gmail.com",
      password: "Test@12345",
    })
    .expect(400);
});

it("fails if incorrect password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "sibi@gmail.com",
      password: "Test@12345",
    })
    .expect(201);
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "sibi@gmail.com",
      password: "Test@1234",
    })
    .expect(400);
});

it("response with cookie on valid credential", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "sibi@gmail.com",
      password: "Test@12345",
    })
    .expect(201);
  const response = await request(app).post("/api/users/signin").send({
    email: "sibi@gmail.com",
    password: "Test@12345",
  });
  expect(response.get("Set-Cookie")).toBeDefined();
});
