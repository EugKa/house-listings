/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { MongoClient } from 'mongodb'

const user = 'Eugene-tiny-pract'
const userPassword = '3eMUnWSIHq8hxuQ2'
const cluster = 'cluster0.6ehmi'

const url = `mongodb+srv://${user}:${userPassword}@${cluster}.mongodb.net/tiny-pract?retryWrites=true&w=majority`

export const connectDatabase = async () => {
    const client = await MongoClient.connect(url, {
        useNewUrlParser: true,
        // useUnifiedTopology: true,
    })
    const db = client.db("main")

    return {
        listnings: db.collection('test_listnings')
    }
}