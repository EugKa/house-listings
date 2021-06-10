import React, { useState } from 'react'
import { Moment } from 'moment'
import { useQuery } from '@apollo/react-hooks'
import { LISTING } from '../../lib/graphql/queries'
import { Listing as ListingData ,ListingVariables } from '../../lib/graphql/queries/Listing/__generated__/Listing'
import { RouteComponentProps } from 'react-router'
import { Layout, Row, Col } from 'antd'
import { PageSkeleton, ErrorBanner } from '../../lib/components'
import { ListingBookings, ListingDetails, ListingCreateBooking, ListingCreateBookingModal } from '../Listing/components'
import { Viewer } from '../../lib/types'

interface MatchParams {
    id: string;
}

interface Props {
    viewer: Viewer;
}

const PAGE_LIMIT = 3;
const { Content } = Layout;

export const Listing = ({match, viewer}: Props & RouteComponentProps<MatchParams>) => {
    const [bookingsPage, setBookingsPage] = useState(1);
    const [checkInDate, setCheckInDate] = useState<Moment | null>(null)
    const [checkOutDate, setCheckOutDate] = useState<Moment | null>(null)
    const [modalVisible, setModalVisible] = useState(false)
    const { loading, data, error, refetch } = useQuery<ListingData ,ListingVariables>(LISTING, {
        variables: {
            id: match.params.id,
            bookingsPage,
            limit: PAGE_LIMIT
        }
    })

    const clearBookingDate = () => {
        setModalVisible(false);
        setCheckInDate(null);
        setCheckOutDate(null);
    }

    const handleListingRefetch = async () => {
        await refetch()
    }

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

    const listingCreateBooking = listing ? (
        <ListingCreateBooking 
            host={listing.host}
            viewer={viewer}
            bookingsIndex={listing.bookingsIndex}
            price={listing.price}
            checkInDate={checkInDate}
            checkOutDate={checkOutDate}
            setCheckInDate={setCheckInDate}
            setCheckOutDate={setCheckOutDate}
            setModalVisible={setModalVisible}
        />
    ) : null;

    const listingCreateBookingModalElement = 
        listing && checkInDate && checkOutDate ? (
        <ListingCreateBookingModal
            id={listing.id}
            price={listing.price}
            checkInDate={checkInDate}
            checkOutDate={checkOutDate}
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            clearBookingDate={clearBookingDate}
            handleListingRefetch={handleListingRefetch}
        />
    ) : null;

    return (
        <Content className="listings">
            <Row gutter={24} justify="space-between">
                <Col xs={24} lg={14}>
                    {ListingDetailsElement}
                    {ListingBookingsElement}
                </Col>
                <Col xs={24} lg={10}>
                    {listingCreateBooking}
                </Col>
            </Row>
            {listingCreateBookingModalElement}
        </Content>
    )
}
