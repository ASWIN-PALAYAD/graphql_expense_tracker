import { mergeResolvers } from "@graphql-tools/merge";

import useResolver from "./user.resolvers.js";
import transactionResolver from "./transaction.resolvers.js";

const mergedResolvers = mergeResolvers([useResolver,transactionResolver]);

export default mergedResolvers;

