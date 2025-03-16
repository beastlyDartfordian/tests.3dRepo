import Ticket, { ITicket } from "../../src/models/ticket";
import mongoose from "mongoose";

describe("Ticket Model", () => {
  it("should create a valid ticket instance", () => {
    const ticketData: Partial<ITicket> = {
      eventId: new mongoose.Types.ObjectId(),
      nTickets: 2,
    };

    const ticket = new Ticket(ticketData);

    expect(ticket.eventId).toBeDefined();
    expect(ticket.nTickets).toBe(2);
    expect(ticket.date).toBeInstanceOf(Date);
  });

  it("should throw a validation error when required fields are missing", async () => {
    const ticket = new Ticket({});

    try {
      await ticket.validate();
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.errors["eventId"]).toBeDefined();
      expect(error.errors["nTickets"]).toBeDefined();
    }
  });

  it("should throw an error if `nTickets` is negative", async () => {
    const ticketData: Partial<ITicket> = {
      eventId: new mongoose.Types.ObjectId(),
      nTickets: -5,
    };

    const ticket = new Ticket(ticketData);

    try {
      await ticket.validate();
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.errors["nTickets"]).toBeDefined();
    }
  });
});
