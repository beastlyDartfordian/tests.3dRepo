import mongoose, { Document, Model, Schema } from "mongoose";

export interface ITicket extends Document {
  eventId: mongoose.Types.ObjectId;
  nTickets: number;
  date: Date;
}

const TicketSchema = new Schema({
  eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  nTickets: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const Event: Model<ITicket> = mongoose.model<ITicket>("Ticket", TicketSchema);
export default Event;
