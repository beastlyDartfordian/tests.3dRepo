import supertest from "supertest";
import mongoose from "mongoose";
import app from "../../src/app";
import Event, { IEvent } from "../../src/models/event";

let eventId: string;

beforeAll(async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('No MongoDb URI provided');
  }
  
  await mongoose.connect(process.env.MONGO_URI);
  await app.ready();

  const event: IEvent = await Event.create({
    name: "Concert",
    date: new Date("2025-10-09"),
    capacity: 100,
    costPerTicket: 20,
  });

  eventId = event._id.toString();
});

afterAll(async () => {
  await mongoose.connection.close();
  await app.close();
});

describe("Ticket Routes", () => {
  it("should create a ticket successfully", async () => {
    const response = await supertest(app.server)
      .post("/tickets")
      .send({
        event: eventId,
        nTickets: 2,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", "Transaction successful");
  });

  it("should return an error when event is missing", async () => {
    const response = await supertest(app.server)
      .post("/tickets")
      .send({
        nTickets: 2,
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should return an error if the event does not exist", async () => {
    const response = await supertest(app.server)
      .post("/tickets")
      .send({
        event: new mongoose.Types.ObjectId().toString(),
        nTickets: 2,
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Event not found");
  });

  it("should return an error if not enough tickets are available", async () => {
    const response = await supertest(app.server)
      .post("/tickets")
      .send({
        event: eventId,
        nTickets: 200,
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Not enough tickets available");
  });
});
