// Create Service
import { UserModel, IUser } from '../entities/user.entity';

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
        const user = new UserModel(data);
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
