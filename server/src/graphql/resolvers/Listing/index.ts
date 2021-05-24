import { IResolvers } from 'apollo-server-express'
import { Request } from 'express';
import { ObjectId } from "mongodb";
import { IListing, Database, User } from '../../../lib/types'
import { authorize } from '../../../lib/utils'
import { ListingArgs, ListingBookingsArgs, ListingBookingsData } from './types';

export const listingsResolver: IResolvers = {
    Query: {
        listing: async (
            _root, 
            { id }: ListingArgs, 
            { db, req }: { db: Database, req: Request }
        ): Promise<IListing> => {
            try {
                const listing = await db.listings.findOne({ _id: new ObjectId(id)})
                if(!listing) {
                    throw new Error("listing can't be found");
                }

                const viewer = await authorize(db, req);
                if(viewer && viewer._id === listing.host) {
                    listing.authorized = true;
                }

                return listing;
            } catch (error) {
                throw new Error(`Field to query listing: ${error}`);
                
            }
        }
    },
    Listing: {
        id: (listing: IListing): string => {
            return listing._id.toString();
        },
        host: async (
            listing: IListing,
            _args,
            { db }: { db: Database }
        ): Promise<User> => {
            const host = await db.users.findOne({ _id: listing.host })
            if(!host) {
                throw new Error("host can't be found");
            }
            return host;
        },
        bookingsIndex: (listing: IListing): string => {
            return JSON.stringify(listing.bookingsIndex)
        },
        bookings: async (
            listing: IListing,
            { limit, page }: ListingBookingsArgs,
            { db }: { db: Database }
          ): Promise<ListingBookingsData | null> => {
            try {
              if (!listing.authorized) {
                return null;
              }
      
              const data: ListingBookingsData = {
                total: 0,
                result: []
              };
      
              let cursor = await db.bookings.find({
                _id: { $in: listing.bookings }
              });
      
              cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0);
              cursor = cursor.limit(limit);
      
              data.total = await cursor.count();
              data.result = await cursor.toArray();
      
              return data;
            } catch (error) {
              throw new Error(`Failed to query listing bookings: ${error}`);
            }
          },
    }
}