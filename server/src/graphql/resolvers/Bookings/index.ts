import { IResolvers } from 'apollo-server-express'
import { ObjectId } from 'mongodb';
import { Request } from 'express';
import { Booking, Database, Listing, bookingsIndex } from '../../../lib/types'
import { authorize } from '../../../lib/utils';
import { CreatebookingArgs } from './types';
import { Stripe } from '../../../lib/api';

const millisecondsPerDay = 86400000;

const resolveBookingsIndex = (
    bookingsIndex: bookingsIndex, 
    checkInDate: string, 
    checkOutDate: string
):bookingsIndex => {
    let dateCursor = new Date(checkInDate)
    const checkOut = new Date(checkOutDate)
    const newBookingsIndex: bookingsIndex = {...bookingsIndex}

    while (dateCursor <= checkOut) {
        const y = dateCursor.getFullYear();
        const m = dateCursor.getUTCMonth();
        const d = dateCursor.getUTCDate();

        if(!newBookingsIndex[y]){
            newBookingsIndex[y] = {};
        }

        if(!newBookingsIndex[y][m]){
            newBookingsIndex[y][m] = {};
        }

        if(!newBookingsIndex[y][m][d]){
            newBookingsIndex[y][m][d] = true;
        } else {
            throw new Error("selected dates can't overlap dates that have already been booked");
        }

        dateCursor = new Date(dateCursor.getTime() + millisecondsPerDay)
    }

    return newBookingsIndex;
}

export const bookingsResolver: IResolvers = {
    Mutation: {
        createBooking: async (
            _root: undefined,
            { input }: CreatebookingArgs,
            { db, req }: { db: Database, req: Request}
        ): Promise<Booking> => {
            try {
                const { id, source, checkIn, checkOut } = input;

                //verify a logged in user is making request
                const viewer = await authorize(db, req);
                if(!viewer) {
                    throw new Error("viewer cannot be found");
                }

                //find listing document that is being booked
                const listing = await db.listings.findOne({
                    _id: new ObjectId(id)
                })
                if(!listing) {
                    throw new Error("listing can't be found");
                }

                //check that viewer is Not booking their own listing
                if(listing.host === viewer._id) {
                    throw new Error("viewer can't book own listing");
                }
                //check that checkOut is Not before checkIn
                const today = new Date()
                const checkInDate = new Date(checkIn)
                const checkOutDate = new Date(checkOut)

                if(checkInDate.getTime() > today.getTime() + 90 * millisecondsPerDay ) {
                    throw new Error("check in date can't be more than 90 days from today");
                }

                if(checkOutDate.getTime() > today.getTime() + 90 * millisecondsPerDay ) {
                    throw new Error("check in date can't be more than 90 days from today");
                }

                if(checkOutDate < checkInDate) {
                    throw new Error("check out date can't be before check in date");
                }

                //create a new bookingsIndex for listing being booked
                const bookingsIndex = resolveBookingsIndex(
                    listing.bookingsIndex,
                    checkIn,
                    checkOut
                )

                //get total price to charge
                const totalPrice = listing.price * ((checkOutDate.getTime() - checkInDate.getTime()) / millisecondsPerDay + 1);
                
                //ger user document of host of listing
                const host = await db.users.findOne({
                    _id: listing.host
                })

                if(!host || !host.walletId) {
                    throw new Error("the host either can't be found or is not connected with Stripe");
                }
                
                // create Stripe charge on behalf of host
                await Stripe.charge(totalPrice, source, host.walletId);

                const insertRes = await db.bookings.insertOne({
                    _id: new ObjectId(),
                    listing: listing._id,
                    tenant: viewer._id,
                    checkIn,
                    checkOut
                })

                //insert a new booking document to bookings collection
                const insertedBooking: Booking = insertRes.ops[0]

                //update user document of host to increment income
                await db.users.updateOne({
                    _id: host._id,
                }, {
                    $inc: { income: totalPrice }
                })

                //update bookings field of tenant
                await db.users.updateOne({
                    _id: viewer._id,
                }, {
                    $push: { bookings: insertedBooking._id }
                })

                //update bookings field of listing document
                await db.listings.updateOne({
                    _id: listing._id,
                }, {
                    $set: { bookingsIndex },
                    $push: { bookings: insertedBooking._id },
                })

                //return newly inserted booking
                return insertedBooking;
            } catch (error) {
                throw new Error(`Failed to create a booking: ${error}`);
            }
        }
    }, 
    Booking: {
        id: (booking: Booking): string => {
            return booking._id.toString();
        },
        listing: (
            booking: Booking, 
            _args, 
            { db }: { db: Database }
        ):Promise<Listing | null> => {
            return db.listings.findOne({_id: booking.listing})
        },
        tenant: (booking: Booking, _args, { db }: { db: Database }) => {
            return db.users.findOne({
                _id: booking.tenant
            })
        }
    }
}