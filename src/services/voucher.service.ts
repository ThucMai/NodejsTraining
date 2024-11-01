import { VoucherModel, IVoucher } from '../entities/voucher.entity';
import { EventService } from './event.service';
import EmailQueue from '../queues/sendmail';
import { EventModel } from '../entities/event.entity';
import { generateVoucherCode } from '../utils/function';
import { ItemStatus, Deleted, AvailableItemMongo, ActiveItem } from '../utils/variable';

export class VoucherService {
    // Get Vouchers
    async getVouchers(id: string | null): Promise<IVoucher[]> {
        if (!id) {
            return await VoucherModel.find(AvailableItemMongo);
        }
        return await VoucherModel.find({ '_id': id, ...AvailableItemMongo });
    }

    // Create Voucher
    async createVoucher(data: Partial<IVoucher>): Promise<IVoucher | boolean | string> {
        const MAX_RETRIES = 3;
        let retryCount = 0;

        while (retryCount < MAX_RETRIES) {
            const session = await VoucherModel.startSession();
            session.startTransaction();
        
            try {
                const eventService = new EventService();
                const event = await eventService.getEvent(data.event_id!);

                if (!event || event.status == ItemStatus.Inactive) {
                    await session.abortTransaction();
                    return 'Cannot find event or event inactive';
                }

                // Check if the event has ended or all vouchers have been released
                if (event.event_date_end < new Date() || event.voucher_quantity <= event.voucher_released) {
                    await session.abortTransaction();
                    return 'Event end or voucher number is maximum';
                }
                let voucher_code = data.voucher_code ?? '';
                if (voucher_code) {
                    const isCodeExist = await VoucherModel.findOne({ voucher_code, ...AvailableItemMongo });
                    if (isCodeExist) {
                        await session.abortTransaction();
                        return 'Your voucher code already exist';
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
                    return false;
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
                return savedVoucher;
            } catch (error) {
                retryCount++;
                console.log(`Retrying transaction... Attempt ${retryCount}`);
                return false;
            } finally {
                await session.endSession();
            }
        }
        throw new Error('Transaction failed after maximum retries.');
    } 

    // Edit Voucher
    async editVoucher(id: string, data: Partial<IVoucher>): Promise<IVoucher | null> {
        const voucherUpdate = await VoucherModel.findOne({ id, ...AvailableItemMongo });
        if (!voucherUpdate) {
            return null;
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
                return null;
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
        return await VoucherModel.findOneAndUpdate({ id }, dataUpdate, {new: true});
    }

    // Delete Voucher
    async deleteVoucher(id: string) {
        return await VoucherModel.findByIdAndUpdate(id, {[Deleted]: true});
    }
}