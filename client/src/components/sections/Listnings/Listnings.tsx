import React, { FC, useState } from 'react'
import { server } from '../../../lib/api'
import { 
    IListingData, 
    IDeleteListningVariables, 
    IDeleteListningData, 
    IListing
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

export const Listnings: FC<Props> = (props) => {
    const [listnings, setListnings] = useState<IListing[] | null>(null)

    const fetchListnings = async () => {
        const {data} = await server.fetch<IListingData>({query: LISTNINGS})
        setListnings(data.listnings)
    }
    const deleteListning = async (id:string) => {
        await server.fetch<IDeleteListningData, IDeleteListningVariables>({
            query: DELETE_LISTNING,
            variables: {
                id
            }
        })
        fetchListnings()
    }
    
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

    return (
        <div>
            {props.title}
            <button onClick={fetchListnings}>Query Listnings</button>
            {renderList}
        </div>
    )
}
