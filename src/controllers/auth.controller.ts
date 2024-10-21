import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

const userService = new UserService();


export const login = async (req: Request, res: Response) => {
    try {
        const result = await userService.login(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const register = async (req: Request, res: Response) => {
    try {
        const result = await userService.register(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}