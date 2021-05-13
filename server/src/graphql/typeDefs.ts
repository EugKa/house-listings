import { gql } from 'apollo-server-express'

export const typeDefs = gql`
    type Listning {
        id: ID!
        title: String!
        image: String!
        address: String!
        price: Int!
        numOfGuests: Int!
        numOfBeds: Int!
        numOfBaths: Int!
        rating: Int!
    }

    type Query {
        listings: [Listning!]!
    }

    type Mutation {
        deleteListing(id: ID!): Listning!
    }
`