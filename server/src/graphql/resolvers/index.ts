import merge from 'lodash.merge'
import { viewResolvers } from "./Viewer";
import { userResolvers } from "./user";

export const resolvers = merge(viewResolvers, userResolvers)