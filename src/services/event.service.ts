import { EventModel, IEvent } from '../entities/event.entity';

export class EventService {
    // Get events
    async getEvents(id: string | null): Promise<IEvent[]> {
        if (!id) {
            return await EventModel.find();
        }
        return await EventModel.find({ '_id': id });
    }

    // Create event
    async createEvent(data: Partial<IEvent>): Promise<IEvent> {
        const event = new EventModel(data);
        return await event.save();
    }

    // Edit event
    async editEvent(id: string, data: Partial<IEvent>): Promise<IEvent | null> {
        return await EventModel.findByIdAndUpdate(id, data, { new: true });
    }

    // Delete event
    async deleteEvent(id: string) {
        return EventModel.findByIdAndDelete(id);
    }
}
