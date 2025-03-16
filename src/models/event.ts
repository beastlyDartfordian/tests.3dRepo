import mongoose, { Document, Schema, Model, Types } from "mongoose";

export interface IEvent extends Document {
  _id: Types.ObjectId;
  name: string;
  date: Date;
  capacity: number;
  costPerTicket: number;
  ticketsSold: number;
}

const EventSchema = new Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true, unique: true, index: true },
  capacity: { type: Number, required: true },
  costPerTicket: { type: Number, required: true },
  ticketsSold: { type: Number, default: 0 },
});

const Event: Model<IEvent> = mongoose.model<IEvent>("Event", EventSchema);
export default Event;
