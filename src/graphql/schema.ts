// schema.ts
import { GraphQLObjectType, GraphQLSchema, GraphQLID, GraphQLString, GraphQLList } from 'graphql';
import { getRepository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

// Define UserType
const UserType = new GraphQLObjectType({
  name: 'user',
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

// Root query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve: async () => {
        const userRepository = getRepository(UserEntity);
        return await userRepository.find();  // Fetch all users
      }
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve: async (_parent, args) => {
        const userRepository = getRepository(UserEntity);
        return await userRepository.findOne(args.id);  // Fetch user by id
      }
    }
  }
});

// Mutation
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString }
      },
      resolve: async (_parent, args) => {
        const userRepository = getRepository(UserEntity);
        const newUser = userRepository.create({ name: args.name, email: args.email });
        return await userRepository.save(newUser);  // Save new user
      }
    },
    updateUser: {
      type: UserType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString }
      },
      resolve: async (_parent, args) => {
        const userRepository = getRepository(UserEntity);
        const user = await userRepository.findOne(args.id);
        if (!user) throw new Error('User not found');
        
        user.name = args.name || user.name;
        user.email = args.email || user.email;
        return await userRepository.save(user);  // Update user
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: GraphQLID }
      },
      resolve: async (_parent, args) => {
        const userRepository = getRepository(UserEntity);
        const user = await userRepository.findOne(args.id);
        if (!user) throw new Error('User not found');
        
        await userRepository.remove(user);  // Delete user
        return user;
      }
    }
  }
});

export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
