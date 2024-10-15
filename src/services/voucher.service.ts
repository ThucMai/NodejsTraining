import { VoucherModel, IVoucher } from '../entities/voucher.entity';
import { EventService } from './event.service';
import EmailQueue from '../queues/sendmail';

export class VoucherService {
    // Get Vouchers
    async getVouchers(id: string | null): Promise<IVoucher[]> {
        if (!id) {
            return await VoucherModel.find();
        }
        return await VoucherModel.find({ '_id': id });
    }

    // Create Voucher
    async createVoucher(data: Partial<IVoucher>): Promise<IVoucher | boolean> {
        const MAX_RETRIES = 3;
        let retryCount = 0;
    
        while (retryCount < MAX_RETRIES) {
            const session = await VoucherModel.startSession();
            session.startTransaction();
        
            try {
                const eventService = new EventService();
                if (!data.event_id) {
                    await session.abortTransaction();
                    return false;
                }
                const event = await eventService.getEvent(data.event_id);

                if (!event) {
                    await session.abortTransaction();
                    return false;
                }
        
                // Check if the event has ended or all vouchers have been released
                if (event.event_date_end < new Date() || event.voucher_quantity <= event.voucher_released) {
                    await session.abortTransaction();
                    return false;
                }
                let voucher_code = data.voucher_code ?? '';
                if (!voucher_code) {
                    voucher_code = generateVoucherCode(7);
                    while (await VoucherModel.findOne({ voucher_code })) {
                        voucher_code = generateVoucherCode(7);
                    }
                }
        
                // Create and save the voucher in the transaction session
                const voucher = new VoucherModel({ ...data, voucher_code });
                const savedVoucher = await voucher.save({ session });

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
        return await VoucherModel.findByIdAndUpdate(id, data, { new: true });
    }

    // Delete Voucher
    async deleteVoucher(id: string) {
        return await VoucherModel.findByIdAndUpdate(id, {'status': 'Inactive'});;
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