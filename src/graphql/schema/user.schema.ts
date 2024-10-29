// schema.ts
import { GraphQLObjectType, GraphQLSchema, GraphQLID, GraphQLString, GraphQLList } from 'graphql';
import { getRepository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { AvailableItem, Deleted } from '../../utils/variable';
import { createUserRule, updateUserRule } from '../validate/user.validate';

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
    const newUser = userRepository.create({
      name: args.name, username: args.username, email: args.email,
      phone: args.phone, password: args.password, status: args.status
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
    
    user.name = args.name || user.name;
    user.username = args.name || user.username;
    user.email = args.email || user.email;
    user.phone = args.phone || user.phone;
    user.password = args.password || user.password;
    user.status = args.status || user.status;
    return await userRepository.save(user);
  }
};

const deleteUser = {
  type: UserType,
  args: IDField,
  resolve: async (_parent: unknown, args: {id: number}) => {
    const userRepository = getRepository(UserEntity);
    const user = await userRepository.findOne({ where: {id: args.id}});
    if (!user) throw new Error('User not found');
    
    user[Deleted] = true;
    return await userRepository.save(user);
  }
}

export const userMutation = {addUser, updateUser, deleteUser};