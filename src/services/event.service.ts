import { EventModel, IEvent } from '../entities/event.entity';
import { EventLockService } from './event_lock.service';
import { Deleted, ItemStatus, ActiveItem, AvailableItemMongo } from '../utils/variable';
const eventLockService = new EventLockService();

export class EventService {
    // Get events
    async getEvents(): Promise<IEvent[]> {
        return await EventModel.find({ ...AvailableItemMongo });
    }

    async getEvent(id: String): Promise<IEvent | null> {
        return await EventModel.findOne({ _id: id, ...AvailableItemMongo });
    }

    // Create event
    async createEvent(data: Partial<IEvent>): Promise<IEvent | null> {
        const event = new EventModel(data);
        return await event.save();
    }

    // Edit event
    async editEvent(id: String, data: Partial<IEvent>): Promise<IEvent | boolean | null> {
        const session = await EventModel.startSession();
        session.startTransaction();

        try {
            const event = await this.getEvent(id);
            if (!event || event.status == ItemStatus.Inactive ) {
                await session.abortTransaction();
                return false;
            }
            const quantityUpdate = data.voucher_quantity || 0;
            if (event.voucher_released < quantityUpdate) {
                await session.abortTransaction();
                return false;
            }

            const savedEvent = await EventModel.findByIdAndUpdate(id, data, { new: true });
            await session.commitTransaction();
            return savedEvent;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
            await eventLockService.deleteEventLock(id, null);
        }
    }

    // Delete event
    async deleteEvent(id: String) {
        const deleteEvent = await EventModel.findOne(id);
        if (deleteEvent) {
            const result = await EventModel.findByIdAndUpdate(id, { [Deleted]: true });
            if (result) return true;
        }
        return false;
    }
}
