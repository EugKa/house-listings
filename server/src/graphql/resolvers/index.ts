import merge from 'lodash.merge'
import { viewResolvers } from "./Viewer";
import { userResolvers } from "./user";
import { listingsResolver } from "./Listing";
import { bookingsResolver } from "./Bookings";

export const resolvers = merge(
    viewResolvers, 
    userResolvers, 
    listingsResolver, 
    bookingsResolver
)