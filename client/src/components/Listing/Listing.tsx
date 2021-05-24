import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { LISTING } from '../../lib/graphql/queries'
import { Listing as ListingData ,ListingVariables } from '../../lib/graphql/queries/Listing/__generated__/Listing'
import { RouteComponentProps } from 'react-router'
import { Layout, Row, Col } from 'antd'
import { PageSkeleton, ErrorBanner } from '../../lib/components'
import { ListingBookings, ListingDetails } from '../Listing/components'

interface MatchParams {
    id: string;
}

const PAGE_LIMIT = 3;
const { Content } = Layout;

export const Listing = ({match}: RouteComponentProps<MatchParams>) => {
    const [bookingsPage, setBookingsPage] = useState(1)
    const { loading, data, error } = useQuery<ListingData ,ListingVariables>(LISTING, {
        variables: {
            id: match.params.id,
            bookingsPage,
            limit: PAGE_LIMIT
        }
    })

    if(loading) {
        return (
            <Content className="listings">
                <PageSkeleton/>
            </Content>
        )
    }

    if(error) {
        return (
            <Content className="listings">
                <ErrorBanner description="This listing may not exist or we've ecncountered an error. Please try againg soon!"/>
                <PageSkeleton/>
            </Content>
        )
    }

    const listing = data ? data.listing : null;
    const listingBookings = listing ? listing.bookings : null;

    const ListingDetailsElement = listing ? (<ListingDetails listing={listing}/>) : null;

    const ListingBookingsElement = listingBookings ? (
        <ListingBookings 
            listingBookings={listingBookings} 
            bookingsPage={bookingsPage} 
            limit={PAGE_LIMIT} 
            setBookingsPage={setBookingsPage}
        />
        ): null;

    return (
        <Content className="listings">
            <Row gutter={24} justify="space-between">
                <Col xs={24} lg={14}>
                    {ListingDetailsElement}
                    {ListingBookingsElement}
                </Col>
            </Row>
        </Content>
    )
}
