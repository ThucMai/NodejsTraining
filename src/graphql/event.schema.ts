// schema.ts
import { GraphQLObjectType, GraphQLSchema, GraphQLID, GraphQLString, GraphQLList } from 'graphql';
import { getRepository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

// Define EventType
export const EventType = new GraphQLObjectType({
  name: 'event',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    username: { type: GraphQLString },
    phone: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    status: { type: GraphQLString }
  })
});

const user = {
  type: EventType,
  args: { id: { type: GraphQLID } },
  resolve: async (_parent: unknown, args: { id: number }) => {
    const userRepository = getRepository(UserEntity);
    return await userRepository.findOne({ where: { id: args.id }});
  }
};

const users = {
  type: new GraphQLList(EventType), // Return a list of EventType
  resolve: async () => {
    const userRepository = getRepository(UserEntity);
    return await userRepository.find();  // Fetch all users
  }
};

export const userQuery = [user, users];


const addUser = {
  type: EventType,
  args: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
    password: { type: GraphQLString },
    status: { type: GraphQLString }
  },
  resolve: async (_parent: unknown, args: {
    name: string, username: string, email: string,
    phone: string, password: string, status: string
  }) => {
    const userRepository = getRepository(UserEntity);
    const newUser = userRepository.create({
      name: args.name, username: args.username, email: args.email,
      phone: args.phone, password: args.password, status: args.status
    });
    return await userRepository.save(newUser);
  }
};

const updateUser = {
  type: EventType,
  args: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
    password: { type: GraphQLString },
    status: { type: GraphQLString }
  },
  resolve: async (_parent: unknown, args: {
    id: number, name: string, username: string, email: string,
    phone: string, password: string, status: string
  }) => {
    const userRepository = getRepository(UserEntity);
    const user = await userRepository.findOne({ where: {id: args.id}});
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
  type: EventType,
  args: {
    id: { type: GraphQLID }
  },
  resolve: async (_parent: unknown, args: {id: number}) => {
    const userRepository = getRepository(UserEntity);
    const user = await userRepository.findOne({ where: {id: args.id}});
    if (!user) throw new Error('User not found');
    
    user.status = 'Inactive';
    return await userRepository.save(user);
  }
}

export const userMutation = [addUser, updateUser, deleteUser];