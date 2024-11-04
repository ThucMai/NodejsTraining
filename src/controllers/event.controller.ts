import { Request, Response } from 'express';
import { EventService } from '../services/event.service';

const eventService = new EventService();

export const getEvents = async (req: Request, res: Response) => {
    try {
        const result = await eventService.getEvents();
        res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }

};

export const getEvent = async (req: Request, res: Response) => {
    try {
        const result = await eventService.getEvent(req.params.id);
        res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        res.status(200).json({ message: 'Server error' });
    }
};

export const createEvent = async (req: Request, res: Response) => {
    try {
        const result = await eventService.createEvent(req.body);
        res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const editEvent = async (req: Request, res: Response) => {
    try {
        const result = await eventService.editEvent(req.params.id, req.body);
        res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        res.status(200).json({ message: 'Server error' });
    }
}

export const deleteEvent = async (req: Request, res: Response) => {
    const result = await eventService.deleteEvent(req.params.id);
    res.status(result.success ? 200 : 400).json(result);
}
