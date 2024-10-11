// Create Service
import { create } from 'domain';
import { UserModel, IUser } from '../entities/user.entity';
import jwt from 'jsonwebtoken';

const bcrypt = require('bcrypt');
const jwtSecret = process.env.JWT_SECRET || '';
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1h';
const hashPassword = async (password: string) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
    }
};

export class UserService {
    async login(data: Partial<IUser>) {
        const { username, password } = data;
        const user = await UserModel.findOne({ username });

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
        const { name, username, email, phone, password } = data;

        const userExist = await UserModel.find({
            $or: [{ username: username }, { email: email }]
        });

        if (userExist.length > 0) {
            return { success: false, message: 'Username or Email is exist!' }
        }
        return this.createUser({name, username, email, phone, password});
    }

    // Get all users
    async getAll(): Promise<IUser[]> {
        return await UserModel.find();
    }

    // Get a user by ID
    async getById(id: string): Promise<IUser | null> {
        return await UserModel.findById(id);
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
        return await UserModel.findByIdAndUpdate(id, data, { new: true });
    }

    // Delete a user by ID
    async deleteUser(id: string): Promise<IUser | null> {
        return await UserModel.findByIdAndDelete(id);
    }
}
