import { Request, Response } from 'express';
import { EventLockService } from '../services/event_lock.service';

const eventLockService = new EventLockService();

export const editable = async (req: Request, res: Response) => {
    const result = await eventLockService.editable(req.params.event_id, req);
    const status = result ? 200 : 409;
    res.json({ status: status });
};

export const enterEdit = async (req: Request, res: Response) => {
    const result = await eventLockService.enterEdit(req.params.event_id, req);
    const status = result ? 200 : 409;
    res.json({ status: status });
}

export const maintainEdit = async (req: Request, res: Response) => {
    const result = await eventLockService.maintainEdit(req.params.event_id, req);
    const status = result ? 200 : 409;
    res.json({ status: status });
}