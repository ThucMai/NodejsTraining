import mongoose, { Schema, Document } from 'mongoose';

// Create an interface for the User
export interface IEventLock extends Document {
    event_id: string;
    user_id: string;
    status: string;
    time_lock: Date;
}

const EventLockSchema: Schema = new Schema({
    event_id: { type: String, required: true },
    user_id: { type: String, required: true },
    status: { type: String, default: 'Locked' },
    time_lock: { type: Date, required: true },
});

export const EventLockModel = mongoose.model<IEventLock>('event_lock', EventLockSchema);