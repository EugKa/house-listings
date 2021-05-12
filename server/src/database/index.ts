/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { MongoClient } from 'mongodb'
import { Database } from '../lib/types'

const url = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_USER_PASSWORD}@${process.env.MONGO_DB_CLUSTER}.mongodb.net/tiny-pract?retryWrites=true&w=majority`

export const connectDatabase = async (): Promise<Database> => {
    const client = await MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    const db = client.db("main")

    return {
        listnings: db.collection('test_listnings')
    }
}