import { EventModel, IEvent, EventStatus } from '../entities/event.entity';

export class EventService {
    // Get events
    async getEvents(): Promise<IEvent[]> {
        return await EventModel.find({ status: EventStatus.ACTIVE });
    }

    async getEvent(id: String): Promise<IEvent | null> {
        return await EventModel.findOne({ _id: id, status: EventStatus.ACTIVE });
    }

    // Create event
    async createEvent(data: Partial<IEvent>): Promise<IEvent> {
        const event = new EventModel(data);
        return await event.save();
    }

    // Edit event
    async editEvent(id: String, data: Partial<IEvent>): Promise<IEvent | boolean | null> {
        const session = await EventModel.startSession();
        session.startTransaction();

        try {
            const event = await EventModel.findById(id);
            if (!event || event.status == EventStatus.INACTIVE) {
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
        }
    }

    // Delete event
    async deleteEvent(id: String) {
        await EventModel.findByIdAndUpdate(id, { status: EventStatus.INACTIVE });
        return true
    }
}
