// Create Service
import { create } from 'domain';
import { UserModel, IUser } from '../entities/user.entity';
import { ItemStatus, ActiveItem, AvailableItemMongo, Deleted } from '../utils/variable';
import jwt from 'jsonwebtoken';
import { hashPassword } from '../utils/function';
const bcrypt = require('bcrypt');
const jwtSecret = process.env.JWT_SECRET || '';
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1h';

export class UserService {
    async login(data: Partial<IUser>) {
        const { username, password } = data;
        const user = await UserModel.findOne({ username, ...ActiveItem, ...AvailableItemMongo });

        if (!user) {
            return { success: false, message: 'Invalid username or password' }
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return { success: false, message: 'Invalid password' }
        }

        // Generate JWT
        const token = jwt.sign({ id: user.id, username: user.username }, jwtSecret, { expiresIn: jwtExpiresIn });

        return { success: true, message: 'Login Success', data: { 'token': token }}
    }

    async register(data: Partial<IUser>) {
        const { name, username, email, phone } = data;

        const userExist = await UserModel.find({
            $or: [{ username: username }, { email: email }]
        });

        if (userExist.length > 0) {
            return { success: false, message: 'Username or Email is exist!' }
        }
        const password = await hashPassword(data.password!);
        return this.createUser({name, username, email, phone, password});
    }

    // Get all users
    async getAll(): Promise<IUser[]> {
        return await UserModel.find({ [Deleted]: false });
    }

    // Get a user by ID
    async getById(id: string): Promise<IUser | null> {
        return await UserModel.findOne({ _id: id, ...AvailableItemMongo });
    }

    // Create a new user
    async createUser(data: Partial<IUser>): Promise<IUser> {
        const password = data.password || '';
        const hashedPassword = await hashPassword(password);
        const user = new UserModel({ ...data, password: hashedPassword });
        return await user.save();
    }

    // Update a user by ID
    async updateUser(id: string, data: Partial<IUser>): Promise<IUser | null> {
        if (data.password) {
            data.password = await hashPassword(data.password);
        }
        return await UserModel.findByIdAndUpdate({ id, ...AvailableItemMongo, ...ActiveItem }, data, { new: true });
    }

    // Delete a user by ID
    async deleteUser(id: string): Promise<IUser | boolean> {
        const result = await UserModel.findByIdAndUpdate(id, {[Deleted]: true});
        return result ? true: false;
    }
}
