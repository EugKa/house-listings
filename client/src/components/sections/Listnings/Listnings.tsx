import React from 'react'
import { server, useQuery } from '../../../lib/api'
import { 
    IListingData, 
    IDeleteListningVariables, 
    IDeleteListningData, 
 } from './types'

const LISTNINGS = `
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

const DELETE_LISTNING = `
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
    const {data, refetch, loading, error} = useQuery<IListingData>(
        LISTNINGS,
        
         )


    const deleteListning = async (id:string) => {
        await server.fetch<IDeleteListningData, IDeleteListningVariables>({
            query: DELETE_LISTNING,
            variables: {
                id
            }
        })
        refetch()
    }

    const listnings = data ? data.listnings : null
    
    const renderList = listnings ? (
        <ul>
            {
                listnings.map((listning) => {
                    return <li style={{display: "flex"}} key={listning.id}>
                        <div style={{paddingRight: "10px"}}>{listning.title}</div>
                        <button onClick={() => deleteListning(listning.id)}>Delete</button>
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

    return (
        <div>
            {props.title}
            {renderList}
        </div>
    )
}
