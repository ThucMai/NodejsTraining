import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

const userService = new UserService();


export const login = async (req: Request, res: Response) => {
    const result = await userService.login(req.body);
    res.json(result);
};

export const register = async (req: Request, res: Response) => {
    const result = await userService.register(req.body);
    res.json(result);
}