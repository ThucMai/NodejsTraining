import { Request, Response } from 'express';
import { message } from '../utils/message';
import { UserService } from '../services/user.service';

const userService = new UserService();


export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await userService.getAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: message.serverError });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await userService.getById(req.params.id);
        res.status(user.success ? 200 : 400).json(user);
    } catch (error) {
        res.status(500).json({message: message.serverError});
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const newUser = await userService.createUser(req.body);
        res.status(newUser.success ? 200 : 400).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(400).json({
            message: 'Failed to create user'
        });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const updatedUser = await userService.updateUser(req.params.id, req.body);
        res.status(updatedUser ? 200 : 400 ).json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(400).json({
            message: 'Update user failed'
        });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const deletedUser = await userService.deleteUser(req.params.id);
        res.status(deletedUser ? 200 : 400 ).json(deletedUser);
    } catch (error) {
        console.error(error);
        res.status(400).json({
            message: 'Failed to delete user'
        });
    }
};
