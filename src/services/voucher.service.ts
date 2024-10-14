import { VoucherModel, IVoucher } from '../entities/voucher.entity';

export class VoucherService {
    // Get Vouchers
    async getVouchers(id: string | null): Promise<IVoucher[]> {
        if (!id) {
            return await VoucherModel.find();
        }
        return await VoucherModel.find({ '_id': id });
    }

    // Create Voucher
    async createVoucher(data: Partial<IVoucher>): Promise<IVoucher> {
        const Voucher = new VoucherModel(data);
        return await Voucher.save();
    }

    // Edit Voucher
    async editVoucher(id: string, data: Partial<IVoucher>): Promise<IVoucher | null> {
        return await VoucherModel.findByIdAndUpdate(id, data, { new: true });
    }

    // Delete Voucher
    async deleteVoucher(id: string) {
        return VoucherModel.findByIdAndDelete(id);
    }
}
