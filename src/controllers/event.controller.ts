import { Request, Response } from 'express';
import { EventService } from '../services/event.service';

const eventService = new EventService();

export const getEvents = async (req: Request, res: Response) => {
    const result = await eventService.getEvents();
    res.json(result);
};

export const getEvent = async (req: Request, res: Response) => {
    const result = await eventService.getEvent(req.params.id);
    res.json(result);
};

export const createEvent = async (req: Request, res: Response) => {
    const result = await eventService.createEvent(req.body);
    res.json(result);
};

export const editEvent = async (req: Request, res: Response) => {
    const result = await eventService.editEvent(req.params.id, req.body);
    res.json(result);
}

export const deleteEvent = async (req: Request, res: Response) => {
    const result = await eventService.deleteEvent(req.params.id);
    res.json(result);
}
