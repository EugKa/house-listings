export interface IListing {
    id: string;
    title: string;
    image: string;
    address: string;
    price: number;
    numOfGuests: number;
    numOfBeds: number;
    numOfBaths: number;
    rating: number;
}

export interface IListingData {
    listnings: IListing[]
}


export interface IDeleteListningData {
    deleteListning: IListing;
}

export interface IDeleteListningVariables {
    id: string
}
