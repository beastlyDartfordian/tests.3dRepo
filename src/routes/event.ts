import { FastifyInstance } from "fastify";
import Event from "../models/event";
import { format, isValid, parse } from 'date-fns';
import { Static, Type } from "@sinclair/typebox";

const EventSchema = Type.Object({
  name: Type.String(),
  date: Type.String(),
  capacity: Type.Number(),
  costPerTicket: Type.Number(),
});

type EventType = Static<typeof EventSchema>;

export default async function eventRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: EventType }>(
    "/events",
    {
      schema: { body: EventSchema },
    },
    async (req, res) => {
      try {
        let { name, date, capacity, costPerTicket } = req.body;

        if (!date || typeof date !== "string") {
          return res.status(400).send({ error: "Date must be a valid string in format DD/MM/YYYY." });
        }

        date = date.trim();

        const eventDate = parse(date, "dd/MM/yyyy", new Date());

        console.log("Parsed Date:", eventDate);

        if (!isValid(eventDate)) {
          return res.status(400).send({ error: "Invalid date format. Use DD/MM/YYYY." });
        }

        const formattedDate = format(eventDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

        console.log("Formatted Date for MongoDB:", formattedDate);

        const event = new Event({
          name,
          date: new Date(formattedDate),
          capacity,
          costPerTicket,
        });

        console.log(event);

        await event.save();
        res.status(201).send({ eventId: event._id });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        res.status(500).send({ error: errorMessage || "Internal server error" });
      }
    }
  );
}
