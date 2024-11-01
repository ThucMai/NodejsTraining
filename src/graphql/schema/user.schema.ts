// schema.ts
import { GraphQLObjectType, GraphQLSchema, GraphQLID, GraphQLString, GraphQLList } from 'graphql';
import { getRepository } from 'typeorm';
import { UserEntity, IUser } from '../entities/user.entity';
import { AvailableItem, ActiveItem, Deleted } from '../../utils/variable';
import { createUserRule, updateUserRule } from '../validate/user.validate';
import { hashPassword } from '../../utils/function';
import jwt from 'jsonwebtoken';
const bcrypt = require('bcrypt');
const jwtSecret = process.env.JWT_SECRET || '';
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1h';

const IDField = {
  id: { type: GraphQLID },
}
const UserFields = {
  name: { type: GraphQLString },
  username: { type: GraphQLString },
  phone: { type: GraphQLString },
  email: { type: GraphQLString },
  password: { type: GraphQLString },
  status: { type: GraphQLString }
};

// Define UserType
export const UserType = new GraphQLObjectType({
  name: 'user',
  fields: () => ({...IDField, ...UserFields})
});

export const login = async (data: Partial<IUser>) => {
  const { username, password } = data;
  const userRepository = getRepository(UserEntity);
  const user = await userRepository.findOne({ where: { username: username as string, ...ActiveItem, ...AvailableItem }});

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

const user = {
  type: UserType,
  args: IDField,
  resolve: async (_parent: unknown, args: { id: number }) => {
    const userRepository = getRepository(UserEntity);
    return await userRepository.findOne({ where: { id: args.id, ...AvailableItem }});
  }
};

const users = {
  type: new GraphQLList(UserType), // Return a list of UserType
  resolve: async () => {
    const userRepository = getRepository(UserEntity);
    return await userRepository.find({ where: AvailableItem });
  }
};

export const userQuery = {user, users};


const addUser = {
  type: UserType,
  args: UserFields,
  resolve: async (_parent: unknown, args: {
    name: string, username: string, email: string,
    phone: string, password: string, status: string
  }) => {
    const { error } = createUserRule(args);
    if (error) {
      throw new Error(`Validation error: ${error.details.map(detail => detail.message).join(', ')}`);
    }

    const userRepository = getRepository(UserEntity);
    const pass = await hashPassword(args.password);
    const newUser = userRepository.create({
      name: args.name, username: args.username, email: args.email,
      phone: args.phone, password: pass
    });
    return await userRepository.save(newUser);
  }
};

const updateUser = {
  type: UserType,
  args: { ...IDField, ...UserFields },
  resolve: async (_parent: unknown, args: {
    id: number, name: string, username: string, email: string,
    phone: string, password: string, status: string
  }) => {
    const { error } = updateUserRule(args);
    if (error) {
      throw new Error(`Validation error: ${error.details.map(detail => detail.message).join(', ')}`);
    }

    const userRepository = getRepository(UserEntity);
    const user = await userRepository.findOne({ where: {id: args.id, ...AvailableItem}});
    if (!user) throw new Error('User not found');
    
    user.name = args.name ?? user.name;
    user.username = args.name ?? user.username;
    user.email = args.email ?? user.email;
    user.phone = args.phone ?? user.phone;
    user.password = args.password ? await hashPassword(args.password) : user.password;
    user.status = args.status ?? user.status;
    return await userRepository.save(user);
  }
};

const deleteUser = {
  type: UserType,
  args: IDField,
  resolve: async (_parent: unknown, args: {id: number}) => {
    const userRepository = getRepository(UserEntity);    
    return await userRepository.update(args.id, {[Deleted]: true});
  }
}

export const userMutation = {addUser, updateUser, deleteUser};