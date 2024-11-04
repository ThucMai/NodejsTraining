import { EventModel, IEvent } from '../entities/event.entity';
import { EventLockService } from './event_lock.service';
import { Deleted, ItemStatus, ActiveItem, AvailableItemMongo } from '../utils/variable';
import { VoucherModel } from '../entities/voucher.entity';
import { BaseResponse } from '../utils/type';
const eventLockService = new EventLockService();

export class EventService {
    // Get events
    async getEvents(): Promise<BaseResponse> {
        const result = await EventModel.find({ ...AvailableItemMongo });
        return { success: true, data: result };
    }

    async getEvent(id: String): Promise<BaseResponse> {
        const result = await EventModel.findOne({ _id: id, ...AvailableItemMongo });
        if (result) {
            return { success: true, data: result };
        }
        return { success: false, message: 'Cannot find event' };
    }

    // Create event
    async createEvent(data: Partial<IEvent>): Promise<BaseResponse> {
        const event = new EventModel(data);
        const result = await event.save();
        if (result) {
            return { success: true, data: result };
        }
        return { success: false, message: 'Cannot create event' }
    }

    // Edit event
    async editEvent(id: String, data: Partial<IEvent>): Promise<BaseResponse> {
        const session = await EventModel.startSession();
        session.startTransaction();

        try {
            const event = await EventModel.findOne({_id: id});
            if (!event || event.status == ItemStatus.Inactive ) {
                await session.abortTransaction();
                return { success: false, message: 'Cannot find event or event is inactive' };
            }

            const savedEvent = await EventModel.findOneAndUpdate({_id: id}, data, { new: true });
            await session.commitTransaction();
            return { success: true, data: savedEvent! };
        } catch (error) {
            await session.abortTransaction();
            return { success: false, message: 'Cannot edit event' };
        } finally {
            await session.endSession();
            await eventLockService.deleteEventLock(id, null);
        }
    }

    // Delete event
    async deleteEvent(id: String): Promise<BaseResponse> {
        const deleteEvent = await EventModel.findOne({_id: id});
        if (deleteEvent) {
            await VoucherModel.updateMany({event_id: id}, { [Deleted]: true });
            const result = await EventModel.findByIdAndUpdate(id, { [Deleted]: true });
            if (result) {
                return { success: true };
            }
        }
        return { success: false };
    }
}
