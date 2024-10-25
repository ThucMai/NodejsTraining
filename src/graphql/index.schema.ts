import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { userQuery, userMutation } from "./user.schema";

// Define Root Query
const RootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    ...userQuery,
    // voucher: voucherQuery,
  },
});

// Define Root Mutation
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    ...userMutation,
    // ...voucherMutations,
  },
});

// Export the combined schema
export const index_schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
