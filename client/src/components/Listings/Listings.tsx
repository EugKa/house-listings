import React from 'react'
import {Button, List, Avatar, Spin, Alert} from 'antd'
import {gql} from 'apollo-boost'
import { useMutation, useQuery } from 'react-apollo'
import { Listing as ListingData } from './__generated__/Listing'
import { DeleteListing as DeleteListingData, DeleteListingVariables} from './__generated__/DeleteListing'
import './Listings.css'
import { ListingsSkeleton } from '../ListingsSkeleton'

const LISTINGS = gql`
    query Listing {
        listings {
            id
            title
            image
            address
            price
            numOfGuests
            numOfBeds
            numOfBaths
            rating
        }  
    }
`

const DELETE_LISTNING = gql`
    mutation DeleteListing($id: ID!) {
        deleteListing(id: $id) {
            id
        }
    }
`

interface Props {
    title: string
}

export const Listings = (props: Props) => {
    const {data, refetch, loading, error} = useQuery<ListingData>(LISTINGS)

    const [deleteListning, 
        {
            loading: deleteListningLoading, error: deleteListningError
        }] = useMutation<DeleteListingData, DeleteListingVariables>(DELETE_LISTNING)

    const handleDeleteListning = async (id:string) => {
        await deleteListning({variables: {id}})
        refetch()
    }

    const listings = data ? data.listings : null
    
    const renderList = listings ? (
        <List 
            itemLayout="horizontal"
            dataSource={listings}
            renderItem={listings => (
                <List.Item actions={
                    [
                        <Button type="primary" onClick={() =>handleDeleteListning(listings.id)}>
                            Delete
                        </Button>
                    ]
                    }>
                    <List.Item.Meta 
                        title={listings.title} 
                        description={listings.address}
                        avatar={
                            <Avatar 
                                src={listings.image} 
                                shape="square"
                                size={48}
                        />}
                    />
                </List.Item>
            )}
        />
    ) : null


    if(loading) {
        return <div className="listings">
            <ListingsSkeleton title={props.title}/>
        </div> 
    }

    if(error) {
        return <div className="listings">
            <ListingsSkeleton title={props.title} error/>
        </div>    
    }


    const deleteListningErrorAlert = deleteListningError
    ? (
        <Alert
            type="error"
            className="listings-skeleton__alert"
            message="Uh oh! Somthing went wrong with deleting - please try again later :("
        />
    ) : null;

    return (
        <div className="listings">
            <Spin spinning={deleteListningLoading}>
                {deleteListningErrorAlert}
                <h1>{props.title}</h1>
                {renderList}
            </Spin>
            
        </div>
    )
}
