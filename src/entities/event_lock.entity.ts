import mongoose, { Schema, Document } from 'mongoose';

// Create an interface for the User
export interface IEventLock extends Document {
    event_id: String;
    user_id: String;
    status: String;
    time_lock: Date;
}

const EventSchema: Schema = new Schema({
    event_id: { type: String, required: true },
    user_id: { type: String, required: true },
    status: { type: String, default: 'Locked' },
    time_lock: { type: Date, required: true },
});

export const EventLockModel = mongoose.model<IEventLock>('event_lock', EventSchema);