import {GraphQLObjectType, GraphQLSchema, GraphQLString} from 'graphql'

const query = new GraphQLObjectType({
    name: "Query",
    fields: {
        hello: {
            type:GraphQLString,
            resolve: () => "hello from query"
        }
    }
})

const mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        hello: {
            type: GraphQLString,
            resolve: () => "hello from mutatuin"
        }
    }
})

export const schema = new GraphQLSchema({query, mutation})