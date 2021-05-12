import { gql } from 'apollo-server-express'

export const typeDefs = gql`
    type Listnings {
        id: ID!
        title: String!
        image: String!
        address: String!
        price: Int!
        numOfGuesets: Int!
        numOfBeds: Int!
        numOfBaths: Int!
        raiting: Int!
    }

    type Query {
        listnings: [Listnings!]!
    }

    type Mutation {
        deleteListning(id: ID!): Listnings!
    }
`