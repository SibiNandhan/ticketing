import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "./../app";
import request from "supertest";
import jwt from "jsonwebtoken";

let mongo: MongoMemoryServer;
beforeAll(async () => {
  jest.mock('../nats-wrapper');

  process.env.JWT_KEY = "Kattapuli";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri);
}, 100000);

beforeEach(async () => {
  jest.clearAllMocks()
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
}, 100000);

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
}, 100000);

global.signin = () => {
  // Build a JWT payload . {id , email}
  const id = new mongoose.Types.ObjectId().toHexString();
  const payload = {
    id: id, //model id
    password: "sibi@123",
  };

  // Create a JWT !
  const token =  jwt.sign(payload, process.env.JWT_KEY!);
  // Build session Object . {jwt : MY_JWT}
  const session = { jwt: token };
  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);
  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");
  //return a string thats the cookie with encoded data
  return [`express:sess=${base64}`];
};
