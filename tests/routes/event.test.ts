import Fastify from "fastify";
import supertest from "supertest";
import app from "../../src/app";
import mongoose from "mongoose";

beforeAll(async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('No MongoDb URI provided');
  }
  
  await mongoose.connect(process.env.MONGO_URI);
  await app.ready();
});

afterAll(async () => {
  await mongoose.connection.close();
  await app.close();
});

describe("Event Routes", () => {
  it("should create an event successfully", async () => {
    const response = await supertest(app.server)
      .post("/events")
      .send({
        name: "Test Event",
        date: "18/07/2025",
        capacity: 100,
        costPerTicket: 10,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("eventId");
  });

  it("should return an error for missing fields", async () => {
    const response = await supertest(app.server).post("/events").send({});
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
});
