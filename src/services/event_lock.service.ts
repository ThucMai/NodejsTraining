import { EventLockModel, IEventLock } from '../entities/event_lock.entity';
import { EventModel, IEvent } from '../entities/event.entity';
import { Request } from 'express';
import { AuthRequest, BaseResponse } from '../utils/type';
import mongoose from 'mongoose';

const time_lock = parseInt(process.env.TIME_LOCK_EVENT || '5'); //minutes

export class EventLockService {
    async editable(event_id: string, req: AuthRequest): Promise<BaseResponse> {

        const session = await EventLockModel.startSession();
        session.startTransaction();

        try {
            const event = await EventModel.findById(event_id);

            if (!event) {
                await session.abortTransaction();
                session.endSession();
                return { success: false };
            }

            const user_id = req?.user?.id || 0;
            const eventLockByMe = await EventLockModel.findOne({
                event_id,
                user_id,
                time_lock: { $gt: new Date(new Date().getTime() - time_lock * 60000) }
            });

            if (eventLockByMe) {
                await session.abortTransaction();
                session.endSession();
                return { success: true };
            } 

            const eventLocked = await EventLockModel.findOne({
                event_id,
                time_lock: { $gt: new Date(new Date().getTime() - time_lock * 60000) }
            });

            if (eventLocked) {
                await session.abortTransaction();
                session.endSession();
                return { success: false };
            }

            await session.commitTransaction();
            session.endSession();
            return { success: true };
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            return { success: false };
        }  
    }

    async enterEdit(event_id: string, req: AuthRequest): Promise<BaseResponse> {
        const session = await EventLockModel.startSession();
        session.startTransaction();

        try {
            const editable = await this.editable(event_id, req);
            if (!editable.success) {
                await session.abortTransaction();
                session.endSession();
                return { success: false };
            };

            await EventLockModel.deleteMany({ event_id });

            const user_id = req?.user?.id || 0;
            const eventLock = new EventLockModel({
                event_id: event_id,
                user_id: user_id,
                time_lock: new Date()
            });
            await eventLock.save();

            await session.commitTransaction();
            session.endSession();
            return { success: true };;
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            return { success: false };
        }
    }

    async maintainEdit(event_id: string, req: AuthRequest): Promise<BaseResponse> {
        const editable = await this.editable(event_id, req);
        if (!editable.success) {
            return { success: false };
        }

        const user_id = req?.user?.id || 0;
        const result = await EventLockModel.findOneAndUpdate(
            {
                event_id,
                user_id
            },
            {
                time_lock: new Date()
            }
        );
        return { success: Boolean(result) };
    }

    async deleteEventLock(event_id: String, user_id: string | null): Promise<boolean> {
        try {
            const query: any = { event_id };
            if (user_id) {
                query.user_id = user_id;
            }
            await EventLockModel.findOneAndDelete(query);
            return true;
        } catch (error) {
            console.error('Delete event lock fail with error: ', error);
            return false;
        }
    }
}