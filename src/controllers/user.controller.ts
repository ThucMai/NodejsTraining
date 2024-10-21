import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

const userService = new UserService();


export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await userService.getAll();
        res.status(200).json({ data: users });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await userService.getById(req.params.id);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({
            message: 'Failed to get user'
        });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const newUser = await userService.createUser(req.body);
        res.status(201).json({ data: newUser });
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
        if (updatedUser) {
            res.status(200).json({ data: updatedUser });
        } else {
            res.status(404).json({ message: 'Update user failed' });
        }
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
        if (deletedUser) {
            res.status(200).json({ message: `User delete successfully` });;
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({
            message: 'Failed to delete user'
        });
    }
};
