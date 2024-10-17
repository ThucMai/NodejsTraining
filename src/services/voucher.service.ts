import { VoucherModel, IVoucher, VoucherStatus } from '../entities/voucher.entity';
import { EventService } from './event.service';
import EmailQueue from '../queues/sendmail';
import { EventModel } from '../entities/event.entity';

export class VoucherService {
    // Get Vouchers
    async getVouchers(id: string | null): Promise<IVoucher[]> {
        if (!id) {
            return await VoucherModel.find({ status: VoucherStatus.ACTIVE });
        }
        return await VoucherModel.find({ '_id': id });
    }

    // Create Voucher
    async createVoucher(data: Partial<IVoucher>): Promise<IVoucher | boolean | string> {
        const MAX_RETRIES = 3;
        let retryCount = 0;

        while (retryCount < MAX_RETRIES) {
            const session = await VoucherModel.startSession();
            session.startTransaction();
        
            try {
                if (!data.event_id) {
                    await session.abortTransaction();
                    return 'Cannot find event';
                }
                const eventService = new EventService();
                const event = await eventService.getEvent(data.event_id);

                if (!event || event.voucher_quantity < event.voucher_released) {
                    await session.abortTransaction();
                    return 'Cannot find event';
                }

                // Check if the event has ended or all vouchers have been released
                if (event.event_date_end < new Date() || event.voucher_quantity <= event.voucher_released) {
                    await session.abortTransaction();
                    return false;
                }
                let voucher_code = data.voucher_code ?? '';
                if (voucher_code) {
                    const isCodeExist = await VoucherModel.findOne({ voucher_code });
                    if (isCodeExist) {
                        await session.abortTransaction();
                        return false;
                    }
                } else {
                    voucher_code = generateVoucherCode(7);
                    while (await VoucherModel.findOne({ voucher_code })) {
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
                    to: data.issued_to,
                    subject: 'Voucher code for you!',
                    text: `This is your voucher code: ${voucher_code}, 
                        You can use this voucher to ${data.expired_date}`
                });

                await session.commitTransaction();
                return savedVoucher;
            } catch (error) {
                retryCount++;
                console.log(`Retrying transaction... Attempt ${retryCount}`);
            } finally {
                await session.endSession();
            }
        }
        throw new Error('Transaction failed after maximum retries.');
    } 

    // Edit Voucher
    async editVoucher(id: string, data: Partial<IVoucher>): Promise<IVoucher | null> {
        return await VoucherModel.findOneAndUpdate({ id, status: VoucherStatus.ACTIVE }, data, { new: true });
    }

    // Delete Voucher
    async deleteVoucher(id: string) {
        return await VoucherModel.findByIdAndUpdate(id, {'status': VoucherStatus.INACTIVE});;
    }
}

function generateVoucherCode(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}