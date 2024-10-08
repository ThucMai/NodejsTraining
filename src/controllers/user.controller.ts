import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

const userService = new UserService();

export const getAllUsers = async (req: Request, res: Response) => {
    console.log('enter get all user');
    const users = await userService.getAll();
    res.json(users);
};

export const getUserById = async (req: Request, res: Response) => {
    const user = await userService.getById(req.params.id);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

export const createUser = async (req: Request, res: Response) => {
    const newUser = await userService.createUser(req.body);
    res.status(201).json(newUser);
};

export const updateUser = async (req: Request, res: Response) => {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    if (updatedUser) {
        res.json(updatedUser);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const deletedUser = await userService.deleteUser(req.params.id);
    if (deletedUser) {
        res.json(deletedUser);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};
