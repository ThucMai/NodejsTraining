import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { userQuery, userMutation } from "./user.schema";
import { eventQuery, eventMutation } from './event.schema';

// Define Root Query
const RootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    ...userQuery,
    ...eventQuery,
  },
});

// Define Root Mutation
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    ...userMutation,
    ...eventMutation,
  },
});

// Export the combined schema
export const index_schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
