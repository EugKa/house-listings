import React from 'react'
import {Skeleton, Divider, Alert} from 'antd'
import './ListingsSkeleton.css'
interface Props {
    title: string
    error?: boolean
}

export const ListingsSkeleton = ({title, error}: Props) => {
    const errorAlert = error ? (
        <Alert
            type="error"
            className="listings-skeleton__alert"
            message="Uh oh! Somthing went wrong with deleting - please try again later :("
        />
    ) : null
    return (
        <div className="listings-skeleton">
            {errorAlert}
            <h2>{title}</h2>
            <Skeleton active paragraph={{rows: 1}}/>
            <Divider/>
            <Skeleton active paragraph={{rows: 1}}/>
            <Divider/>
            <Skeleton active paragraph={{rows: 1}}/>
        </div>
        
    )
}
