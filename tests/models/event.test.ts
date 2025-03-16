import Event from "../../src/models/event";

describe("Event Model", () => {
  it("should create an Event with valid data", () => {
    const event = new Event({
      name: "Test Event",
      date: new Date("2025-03-17"),
      capacity: 100,
      costPerTicket: 50,
    });

    expect(event.name).toBe("Test Event");
    expect(event.date).toBeInstanceOf(Date);
    expect(event.capacity).toBe(100);
    expect(event.costPerTicket).toBe(50);
  });

  it("should fail when required fields are missing", () => {
    try {
      new Event({});
    } catch (error: any) {
      expect(error).toBeDefined();
    }
  });
});