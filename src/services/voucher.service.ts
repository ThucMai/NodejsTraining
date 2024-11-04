import { VoucherModel, IVoucher } from '../entities/voucher.entity';
import { EventService } from './event.service';
import EmailQueue from '../queues/sendmail';
import { EventModel } from '../entities/event.entity';
import { generateVoucherCode } from '../utils/function';
import { BaseResponse } from '../utils/type';
import { ItemStatus, Deleted, AvailableItemMongo, ActiveItem } from '../utils/variable';

export class VoucherService {
    // Get Vouchers
    async getVouchers(id: string | null): Promise<BaseResponse> {
        if (!id) {
            const result =  await VoucherModel.find(AvailableItemMongo);
            if (result) {
                return { success: true, data: result };
            }
            return { success: false, message: 'Cannot find voucher' };
        } else {
            const result = await VoucherModel.find({ '_id': id, ...AvailableItemMongo });
            return { success: true, data: result };
        }
    }

    // Create Voucher
    async createVoucher(data: Partial<IVoucher>): Promise<BaseResponse> {
        const MAX_RETRIES = 3;
        let retryCount = 0;

        while (retryCount < MAX_RETRIES) {
            const session = await VoucherModel.startSession();
            session.startTransaction();
        
            try {
                const event = await EventModel.findOne({_id: data.event_id!});

                if (!event || event.status == ItemStatus.Inactive) {
                    await session.abortTransaction();
                    return { success: false, message: 'Cannot find event or event inactive' };
                }

                // Check if the event has ended or all vouchers have been released
                if (event.event_date_end < new Date() || event.voucher_quantity <= event.voucher_released) {
                    await session.abortTransaction();
                    return { success: false, message: 'Event end or voucher number is maximum' };
                }
                let voucher_code = data.voucher_code ?? '';
                if (voucher_code) {
                    const isCodeExist = await VoucherModel.findOne({ voucher_code, ...AvailableItemMongo });
                    if (isCodeExist) {
                        await session.abortTransaction();
                        return { success: false, message: 'Your voucher code already exist' };
                    }
                } else {
                    voucher_code = generateVoucherCode(7);
                    while (await VoucherModel.findOne({ voucher_code: voucher_code, ...AvailableItemMongo })) {
                        voucher_code = generateVoucherCode(7);
                    }
                }

                const eventUpdate = await EventModel.findOneAndUpdate(
                    { _id: event._id }, { $inc: { voucher_released: 1 } }, { new: true }
                );
                if (!eventUpdate) {
                    await session.abortTransaction();
                    return { success: false, message: 'Cannot release voucher' };
                }

                // Create and save the voucher in the transaction session
                if (!data.issued_date) {
                    data.issued_date = new Date();
                }
                data.event = eventUpdate;
                data.expired_date = eventUpdate.event_date_end;
                const voucher = new VoucherModel({ ...data, voucher_code,  });
                const savedVoucher = await voucher.save();

                // Push email to queue
                EmailQueue.add({
                    to: savedVoucher.issued_to,
                    subject: 'Voucher code for you!',
                    text: `This is your voucher code: ${voucher_code}, 
                        You can use this voucher to ${savedVoucher.expired_date}`
                });

                await session.commitTransaction();
                return { success: true, data: savedVoucher};
            } catch (error) {
                retryCount++;
                console.log(`Retrying transaction... Attempt ${retryCount}`);
                return { success: false, message: 'Cannot release voucher' };
            } finally {
                await session.endSession();
            }
        }
        throw new Error('Transaction failed after maximum retries.');
    } 

    // Edit Voucher
    async editVoucher(id: string, data: Partial<IVoucher>): Promise<BaseResponse> {
        const voucherUpdate = await VoucherModel.findOne({ id, ...AvailableItemMongo });
        if (!voucherUpdate) {
            return { success: false, message: 'Cannot find voucher to update' };
        }
        let voucherCode = '';
        if (!data.voucher_code) {
            voucherCode = voucherUpdate.voucher_code;
        } else { //check the code submit
            const isExist = await VoucherModel.findOne({ 
                _id: { $ne: id }, 
                voucher_code: data.voucher_code,
                ...ActiveItem
            });
            if (isExist) {
                return { success: false, message: 'Voucher code is already exist' };
            }
            voucherCode = data.voucher_code;
        }
        const dataUpdate = {
            event_id: data.event_id ?? voucherUpdate.event_id,
            event: data.event ?? voucherUpdate.event,
            voucher_code: voucherCode,
            issued_to: data.issued_to ?? voucherUpdate.issued_to,
            issued_date: data.issued_date ?? voucherUpdate.issued_date,
            expired_date: data.expired_date ?? voucherUpdate.expired_date
        }
        const result = await VoucherModel.findOneAndUpdate({ id }, dataUpdate, {new: true});
        if (result) {
            return { success: true, data: result };
        }
        return { success: false, message: 'Cannot edit voucher' };
    }

    // Delete Voucher
    async deleteVoucher(id: string): Promise<BaseResponse> {
        const result = await VoucherModel.findByIdAndUpdate(id, {[Deleted]: true});
        return { success: Boolean(result) };
    }
}