// Create an Entity and Model
import mongoose, { Schema, Document } from 'mongoose';

// Create an interface for the User
export interface IUser extends Document {
    name: string;
    email: string;
    phone: string;
    password: string;
}

// Create a schema for the User
const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: false },
    password: { type: String, required: true },
});

export const UserModel = mongoose.model<IUser>('users', UserSchema);
