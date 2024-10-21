import mongoose, { Schema, Document } from 'mongoose';

// Create an interface for the User
export interface IVoucher extends Document {
    event_id: String;
    event: Object;
    voucher_code: String;
    issued_to: String;
    issued_date: Date;
    expired_date: Date;
    status: String;
}

const VoucherStatus = {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
};

const VoucherSchema: Schema = new Schema({
    event_id: { type: String, required: true },
    event: { type: Object },
    voucher_code: { type: String, required: true, unique: true },
    issued_to: { type: String},
    issued_date: { type: Date, required: true },
    expired_date: { type: Date, required: true },
    status: { type: String, default: VoucherStatus.ACTIVE, enum: Object.values(VoucherStatus) }
});

const VoucherModel = mongoose.model<IVoucher>('vouchers', VoucherSchema);

export { VoucherModel, VoucherStatus }