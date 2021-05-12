import express, {Application} from 'express'

import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './graphql';
import {connectDatabase} from './database'

const port = 5000;


const mount = async (app:Application) => {
    const db = await connectDatabase()
    const server = new ApolloServer({
        typeDefs, 
        resolvers, 
        context: () => ({db})
    });
    server.applyMiddleware({app, path: "/api"})
    
    app.listen(port);
    
    console.log(`[app]: http://localhost:${port}`);

    const listnings = await db.listnings.find({}).toArray()
    console.log(listnings);
    
}

mount(express())