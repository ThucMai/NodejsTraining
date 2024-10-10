// Create Service
import { UserModel, IUser } from '../entities/user.entity';
const bcrypt = require('bcrypt');
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
