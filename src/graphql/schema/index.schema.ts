import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { userQuery, userMutation } from "./user.schema";
import { eventQuery, eventMutation } from './event.schema';
import { voucherQuery, voucherMutation } from './voucher.schema';
import { eventLockQuery, eventLockMutation } from './event_lock.schema';

// Define Root Query
const RootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    ...userQuery,
    ...eventQuery,
    ...voucherQuery,
    ...eventLockQuery
  },
});

// Define Root Mutation
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    ...userMutation,
    ...eventMutation,
    ...voucherMutation,
    ...eventLockMutation
  },
});

// Export the combined schema
export const index_schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
