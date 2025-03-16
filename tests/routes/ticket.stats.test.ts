import supertest from "supertest";
import mongoose from "mongoose";
import app from "../../src/app";
import Event from "../../src/models/event";
import Ticket from "../../src/models/ticket";

beforeAll(async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('No MongoDb URI provided');
  }
  
  await mongoose.connect(process.env.MONGO_URI);
  await app.ready();

  const event1 = await Event.create({
    name: "Music Festival",
    date: new Date("2024-03-10"),
    capacity: 200,
    costPerTicket: 50,
    ticketsSold: 10,
  });

  const event2 = await Event.create({
    name: "Tech Conference",
    date: new Date("2024-02-15"),
    capacity: 300,
    costPerTicket: 100,
    ticketsSold: 30,
  });

  await Ticket.create([
    { eventId: event1._id, nTickets: 10 },
    { eventId: event2._id, nTickets: 30 },
  ]);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await app.close();
});

describe("Ticket Sales Statistics (/tickets/stats)", () => {
  it("should return monthly ticket sales stats for the past 12 months", async () => {
    const response = await supertest(app.server).get("/tickets/stats");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });
});
