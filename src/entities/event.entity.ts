import mongoose, { Schema, Document } from 'mongoose';
import { ItemStatus, Deleted } from '../utils/variable';

// Create an interface for the User
export interface IEvent extends Document {
    event_name: string;
    description: Text;
    event_date_start: Date;
    event_date_end: Date;
    voucher_quantity: number;
    voucher_released: number;
    status: string;
    [Deleted] : boolean;
}

const EventSchema: Schema = new Schema({
    event_name: { type: String, required: true },
    description: { type: String },
    event_date_start: { type: Date, required: true },
    event_date_end: { type: Date, required: true },
    voucher_quantity: { type: Number },
    voucher_released: { type: Number },
    status: { type: String, default: ItemStatus.Active, enum: Object.values(ItemStatus) },
    [Deleted]: { type: Boolean }
});

const EventModel = mongoose.model<IEvent>('events', EventSchema)
export { EventModel };