import { MongoClient } from 'mongodb'
import { Database, User, IListing, Booking } from '../lib/types'

const {MONGO_DB_USER, MONGO_DB_USER_PASSWORD, MONGO_DB_CLUSTER} = process.env


const url = `mongodb+srv://${MONGO_DB_USER}:${MONGO_DB_USER_PASSWORD}@${MONGO_DB_CLUSTER}.mongodb.net/tiny-pract?retryWrites=true&w=majority`

export const connectDatabase = async (): Promise<Database> => {
    const client = await MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    const db = client.db("main")

    return {
        bookings: db.collection<Booking>("bookings"),
        listings: db.collection<IListing>('listnings'),
        users: db.collection<User>("users")
    }
}