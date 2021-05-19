import { IResolvers } from 'apollo-server-express'
import { IListing } from '../../../lib/types'

export const listingsResolver: IResolvers = {
    Listing: {
        id: (listing: IListing): string => {
            return listing._id.toString();
        }
    }
}