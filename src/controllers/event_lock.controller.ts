import { Request, Response } from 'express';
import { EventLockService } from '../services/event_lock.service';

const eventLockService = new EventLockService();

export const editable = async (req: Request, res: Response) => {
    const result = await eventLockService.editable(req.params.id, req);
    const status = result.success ? 200 : 409;
    res.status(status).json(result);
};

export const enterEdit = async (req: Request, res: Response) => {
    const result = await eventLockService.enterEdit(req.params.id, req);
    const status = result.success ? 200 : 409;
    res.status(status).json(result);
}

export const maintainEdit = async (req: Request, res: Response) => {
    const result = await eventLockService.maintainEdit(req.params.id, req);
    const status = result ? 200 : 409;
    res.status(status).json({ message: result ? 'Maintain status complete' : 'Fail' });
}