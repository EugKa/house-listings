import React from 'react'
import {gql} from 'apollo-boost'
import { useMutation, useQuery } from 'react-apollo'
import { 
    IListingData, 
    IDeleteListningVariables, 
    IDeleteListningData, 
 } from './types'

const LISTNINGS = gql`
    query Listning {
        listnings {
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
    mutation DeleteListning($id: ID!) {
        deleteListning(id: $id) {
            id
        }
    }
`

interface Props {
    title?: string
}

export const Listnings = (props: Props) => {
    const {data, refetch, loading, error} = useQuery<IListingData>(LISTNINGS)

    const [deleteListning, 
        {
            loading: deleteListningLoading, error: deleteListningError
        }] = useMutation<IDeleteListningData, IDeleteListningVariables>(DELETE_LISTNING)

    const handleDeleteListning = async (id:string) => {
        await deleteListning({variables: {id}})
        refetch()
    }

    const listnings = data ? data.listnings : null
    
    const renderList = listnings ? (
        <ul>
            {
                listnings.map((listning) => {
                    return <li style={{display: "flex"}} key={listning.id}>
                        <div style={{paddingRight: "10px"}}>{listning.title}</div>
                        <button onClick={() => handleDeleteListning(listning.id)}>Delete</button>
                        </li>
                })
            }
        </ul>
    ) : null

    if(loading) {
        return <h2>Loading...</h2>
    }

    if(error) {
        return <h2>Yh oh! Somthing went wrong - please try again later :(</h2>   
    }

    const deleteListningLoadingMassage = deleteListningLoading
    ? (
        <h4>Deletion in progress...</h4>
    ) : null;

    const deleteListningErrorMassage = deleteListningError
    ? (
        <h4>Uh oh! Somthing went wrong with deleting - please try again later :(</h4>
    ) : null;

    return (
        <div>
            <h1>{props.title}</h1>
            {renderList}
            {deleteListningLoadingMassage}
            {deleteListningErrorMassage}
        </div>
    )
}
