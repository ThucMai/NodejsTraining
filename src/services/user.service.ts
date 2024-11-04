// Create Service
import { UserModel, IUser } from '../entities/user.entity';
import { ItemStatus, ActiveItem, AvailableItemMongo, Deleted } from '../utils/variable';
import jwt from 'jsonwebtoken';
import { hashPassword } from '../utils/function';
import { jwtSecret, jwtExpiresIn } from '../utils/variable';
import { BaseResponse } from '../utils/type';
const bcrypt = require('bcrypt');

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
    async getAll(): Promise<BaseResponse> {
        const result = await UserModel.find(AvailableItemMongo);
        return { success: true, data: result };
    }

    // Get a user by ID
    async getById(id: string): Promise<BaseResponse> {
        const result = await UserModel.findOne({ _id: id, ...AvailableItemMongo });
        if (result) {
            return { success: true, data: result };
        }
        return { success: false, message: 'Cannot find users' };
    }

    // Create a new user
    async createUser(data: Partial<IUser>): Promise<BaseResponse> {
        const userExist = await UserModel.find({
            $or: [{ username: data.username }, { email: data.email }]
        });
        if (userExist.length > 0) {
            return { success: false, message: 'Username or Email already exist' };
        }

        const password = data.password || '';
        const hashedPassword = await hashPassword(password);
        const user = new UserModel({ ...data, password: hashedPassword });
        const result = await user.save();
        if (result) {
            return { success: true, data: result };
        }
        return { success:false, message: 'Create user failed' };
    }

    // Update a user by ID
    async updateUser(id: string, data: Partial<IUser>): Promise<BaseResponse>  {
        if (data.email || data.username) {
            const username = data.username;
            const email = data.email;
            let checkExistCondition  = [];
            if (username) {
                checkExistCondition.push({ username: username });
            }
            if (email) {
                checkExistCondition.push({ email: email });
            }
            const isExist = await UserModel.find({
                $and: [
                    { _id: { $ne: id } },
                    { $or: checkExistCondition }
                ]
            });
            if (isExist.length > 0) {
                return { success: false, message: 'Username or email already exist' };
            }
        }
        if (data.password) {
            data.password = await hashPassword(data.password);
        }
        const result = await UserModel.findOneAndUpdate({  _id: id, ...AvailableItemMongo, ...ActiveItem }, data, { new: true });
        if (result) {
            return { success: true, data: result };
        }
        return { success: false, message: 'Failed when update user' };
    }

    // Delete a user by ID
    async deleteUser(id: string): Promise<BaseResponse> {
        const result = await UserModel.findByIdAndUpdate(id, {[Deleted]: true});
        return result ? { success: true }: { success: false };
    }
}
