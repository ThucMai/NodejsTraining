import mongoose, { Schema, Document } from 'mongoose';

// Create an interface for the User
export interface IEvent extends Document {
    event_name: String;
    description: Text;
    event_date_start: Date;
    event_date_end: Date;
    voucher_quantity: Number;
    voucher_released: Number;
}

const EventSchema: Schema = new Schema({
    event_name: { type: String, required: true },
    description: { type: String },
    event_date_start: { type: Date, required: true },
    event_date_end: { type: Date, required: true },
    voucher_quantity: { type: Number},
    voucher_released: { type: Number},
});

export const EventModel = mongoose.model<IEvent>('events', EventSchema);