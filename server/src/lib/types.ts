import { ObjectId, Collection } from 'mongodb'

export interface IListing {
    _id: ObjectId;
    title: string;
    image: string;
    address: string;
    price: number;
    numOfGuests: number;
    numOfBeds: number;
    numOfBaths: number;
    rating: number;
}

export interface Database {
    listnings: Collection<IListing>
}