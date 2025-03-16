import { FastifyInstance } from "fastify";
import mongoose from "mongoose";
import Event from "../models/event";
import Ticket from "../models/ticket";
import { Static, Type } from "@sinclair/typebox";
import { startOfMonth, subMonths } from "date-fns";

const TicketSchema = Type.Object({
  event: Type.String(),
  nTickets: Type.Number(),
});

const QuerySchema = Type.Object({
  months: Type.Optional(Type.Number({ minimum: 1})),
});

type TicketType = Static<typeof TicketSchema>;
type QueryType = Static<typeof QuerySchema>;

export default async function ticketRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: TicketType }>(
    "/tickets",
    {
      schema: { body: TicketSchema },
    },
    async (req, res) => {
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        const { event, nTickets } = req.body;

        const eventData = await Event.findById(event);
        if (!eventData) {
          return res.status(404).send({ error: "Event not found" });
        }

        if (eventData.ticketsSold + nTickets > eventData.capacity) {
          return res.status(400).send({ error: "Not enough tickets available" });
        }

        const ticket = new Ticket({ eventId: event, nTickets });
        await ticket.save();

        eventData.ticketsSold += nTickets;
        await eventData.save();

        res.status(201).send({ message: "Transaction successful" });
      } catch (err) {
        res.status(500).send({ error: err instanceof Error ? err.message : "Internal server error" });
      }
    }
  );

  fastify.get<{ Querystring: QueryType }>(
    "/tickets/stats",
    {
      schema: {
        querystring: QuerySchema,
      },
    },
    async (req, res) => {
      try {
        const months = req.query.months || 12;
        const monthsPrior = startOfMonth(subMonths(new Date(), months));

        const stats = await Event.aggregate([
          { $match: { date: { $gte: monthsPrior } } },
          {
            $group: {
              _id: { year: { $year: "$date" }, month: { $month: "$date" } },
              revenue: { $sum: { $multiply: ["$ticketsSold", "$costPerTicket"] } },
              nEvents: { $sum: 1 },
              totalTicketsSold: { $sum: "$ticketsSold" },
            },
          },
          {
            $project: {
              year: "$_id.year",
              month: "$_id.month",
              revenue: 1,
              nEvents: 1,
              averageTicketsSold: {
                $cond: { if: { $eq: ["$nEvents", 0] }, then: 0, else: { $divide: ["$totalTicketsSold", "$nEvents"] } },
              },
            },
          },
          { $sort: { "year": -1, "month": -1 } },
        ]);

        res.send(stats);
      } catch (err) {
        res.status(500).send({ error: err instanceof Error ? err.message : "Internal server error" });
      }
  });
}
