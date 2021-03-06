import React from 'react'
import { List, Typography } from "antd";
import { User } from '../../../../lib/graphql/queries/User/__generated__/User';
import { ListingCard } from '../../../../lib/components';

interface Props {
    userBookings: User['user']['bookings'];
    bookingsPage: number;
    limit: number;
    setBookingsPage: (page: number) => void;
}

const { Paragraph, Title, Text } = Typography;

export const UserBookings = ({
    userBookings, 
    bookingsPage, 
    limit, 
    setBookingsPage
}:Props) => {

    const total = userBookings ? userBookings.total : null;
    const result = userBookings ? userBookings.result : null;

    const userBookingsList = userBookings ? (
        <List
            grid={{
                gutter: 8,
                    xs: 1,
                    sm: 2,
                    md: 2,
                    lg: 4,
                    xl: 4,
                    xxl: 4
            }}
            dataSource={result ? result : undefined}
            locale={{ emptyText: "You haven't mage any bookings" }}
            pagination={{
                position: "top",
                current: bookingsPage,
                total: total ? total : undefined,
                defaultPageSize: limit,
                hideOnSinglePage: true,
                showLessItems: true,
                onChange: (page: number) => setBookingsPage(page)
            }}
            renderItem={userBookings => {
                const bookingsHistiory = (
                    <div className="user-bookings__bookings-history">
                        <div>
                            Check in: <Text strong> {userBookings.checkIn}</Text>
                        </div>
                        <div>
                            Check out: <Text strong> {userBookings.checkOut}</Text>
                        </div>
                    </div>
                )
                return (
                    <List.Item>
                        {bookingsHistiory}
                    <ListingCard listing={userBookings.listing}/>
                </List.Item>
                )
            }}
        />
    ) : null;

    const userBookingsElement = userBookingsList ? (
        <div className="user-bookings">
            <Title level={4} className="user-bookings__title">
                Bookings
            </Title>
            <Paragraph className="user-bookings__description">
                This section highlights the bookings you've made, and the check-in/check-out dates associated with said bookings 
            </Paragraph>
            {userBookingsList}
        </div>
    ) : null;

    return userBookingsElement;
}