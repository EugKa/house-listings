import { IResolvers } from 'apollo-server-express'
import { Booking, Database, IListing } from '../../../lib/types'

export const bookingsResolver: IResolvers = {
    Booking: {
        id: (booking: Booking): string => {
            return booking._id.toString();
        },
        listing: (
            booking: Booking, 
            _args, 
            { db }: { db: Database }
        ):Promise<IListing | null> => {
            return db.listings.findOne({_id: booking.listing})
        }
    }
}