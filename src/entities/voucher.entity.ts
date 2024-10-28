import mongoose, { Schema, Document } from 'mongoose';
import { ItemStatus, Deleted } from '../utils/variable';

// Create an interface for the User
export interface IVoucher extends Document {
    event_id: String;
    event: Object;
    voucher_code: string;
    issued_to: string;
    issued_date: Date;
    expired_date: Date;
    status: String;
    [Deleted] : Boolean;
}

const VoucherSchema: Schema = new Schema({
    event_id: { type: String, required: true },
    event: { type: Object },
    voucher_code: { type: String, required: true, unique: true },
    issued_to: { type: String},
    issued_date: { type: Date, required: true },
    expired_date: { type: Date, required: true },
    status: { type: String, default: ItemStatus.Active, enum: Object.values(ItemStatus) },
    [Deleted]: { type: Boolean }
});

const VoucherModel = mongoose.model<IVoucher>('vouchers', VoucherSchema);

export { VoucherModel }