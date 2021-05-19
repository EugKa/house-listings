import React, {useState} from 'react'
import { useQuery } from '@apollo/react-hooks'
import { USER } from '../../lib/graphql/queries'
import { User as UserData, UserVariables } from '../../lib/graphql/queries/User/__generated__/User'
import { RouteComponentProps } from 'react-router'
import { Col, Row, Layout } from "antd";
import { UserProfile, UserBookings, UserListings } from "./components";
import { Viewer } from '../../lib/types'
import { ErrorBanner, PageSkeleton } from '../../lib/components'

interface MatchParams {
    id: string
}
interface Props {
    viewer: Viewer
}

const {Content} = Layout;
const PAGE_LIMIT = 4

export const User = ({match, viewer}:Props & RouteComponentProps<MatchParams>) => {
    const [bookingsPage, setBookingsPage] = useState(1)
    const [listingsPage, setListingsPage] = useState(1)
    const { data, loading, error } = useQuery<UserData, UserVariables>(USER, {
        variables : {
            id: match.params.id,
            bookingsPage,
            listingsPage,
            limit:PAGE_LIMIT
        }
    })

    if(loading) {
        return (
            <Content className="user">
                <PageSkeleton/>
            </Content>
        )
    }

    if(error) {
        return (
            <Content className="user">
                <ErrorBanner description="This user may not exist or we've encountered an error. Please try again soon."/>
                <PageSkeleton/>
            </Content>
        )
    }

    const user = data ? data.user : null;
    const viewerIsUser = viewer.id === match.params.id;

    const userListings = user ? user.listings : null;
    const userBookings = user ? user.bookings : null;

    const userProfileElement = user ? <UserProfile user={user} viewerIsUser={viewerIsUser}/> : null;
    
    const userListingsElement = userListings ? (
        <UserListings 
            userListings={userListings} 
            listingsPage={listingsPage} 
            limit={PAGE_LIMIT} 
            setListingsPage={setListingsPage}
        />
    ): null;

    const userBookingsElement = userBookings ? (
        <UserBookings 
            userBookings={userBookings} 
            bookingsPage={bookingsPage} 
            limit={PAGE_LIMIT} 
            setBookingsPage={setBookingsPage}
        />
    ): null;

    return (
        <Content className="user">
            <Row gutter={12}  justify="space-between">
                <Col xs={24}>{userProfileElement}</Col>
                <Col xs={24}>
                    {userListingsElement}
                    {userBookingsElement}
                </Col>
            </Row>
        </Content>
    )
}
