import { EventLockModel, IEventLock } from '../entities/event_lock.entity';
import { EventModel, IEvent } from '../entities/event.entity';
import { Request } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';

const time_lock = parseInt(process.env.TIME_LOCK_EVENT || '5'); //minutes

export class EventLockService {
    async editable(event_id: string, req: AuthRequest): Promise<boolean> {
        const event = await EventModel.findById(event_id);

        if (!event) {
            return false;
        }

        const user_id = req?.user?.id || 0;
        const eventLockByMe = await EventLockModel.findOne({
            event_id,
            user_id,
            time_lock: { $gt: new Date(new Date().getTime() - time_lock * 60000) }
        });

        if (eventLockByMe) {
            return true;
        } 

        const eventLocked = await EventLockModel.findOne({
            event_id,
            time_lock: { $gt: new Date(new Date().getTime() - time_lock * 60000) }
        });

        if (eventLocked) {
            return false;
        }
        return true;
    }

    async enterEdit(event_id: string, req: AuthRequest): Promise<boolean> {
        const editable = await this.editable(event_id, req);
        if (!editable) return false;

        await EventLockModel.deleteMany({ event_id });
        const user_id = req?.user?.id || 0;
        const eventLock = new EventLockModel({
            event_id: event_id,
            user_id: user_id,
            time_lock: new Date()
        });
        await eventLock.save();

        return true;
    }

    async maintainEdit(event_id: string, req: AuthRequest): Promise<boolean> {
        const editable = await this.editable(event_id, req);
        if (!editable) return false;

        const user_id = req?.user?.id || 0;
        const result = await EventLockModel.findOneAndUpdate(
            {
                event_id,
                user_id,
                time_lock: { $gt: new Date(new Date().getTime() - time_lock * 60000) }
            },
            {
                time_lock: new Date()
            }
        );
        return result ? true : false;
    }
}