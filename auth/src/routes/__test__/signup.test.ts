import request from "supertest";
import { app } from "../../app";

it("returns 201 on a successfull signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});

it("Returns 400 status with invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "sds",
      password: "password",
    })
    .expect(400);
});
it("Returns 400 status with invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "sibi@gmail.com",
      password: "p",
    })
    .expect(400);
});
it("Returns 400 status with missing email and password", async () => {
  await request(app).post("/api/users/signup").send({}).expect(400);
});

it("Returns 400 on duplicate email", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "sibi@gmail.com",
      password: "Test@12345",
    })
    .expect(201);
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "sibi@gmail.com",
      password: "Test@12345",
    })
    .expect(400);
});

it("sets a cookie after successfull signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "sibi@gmail.com",
      password: "Test@12345",
    })
    .expect(201);
  expect(response.get("Set-Cookie")).toBeDefined();
});
