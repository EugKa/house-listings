import React from 'react'
import { Modal, Button, Divider, Typography } from 'antd'
import { KeyOutlined } from "@ant-design/icons";
import moment, { Moment } from 'moment';
import { displayErrorMessage, displaySuccessNotification, formatListingPrice } from '../../../../lib/utils';
import {
    CardElement,
    useStripe,
    useElements,
  } from '@stripe/react-stripe-js';
import { useMutation } from '@apollo/react-hooks';
import { CREATE_BOOKING } from '../../../../lib/graphql/mutations';
import { CreateBooking as CreateBookingData, CreateBookingVariables } from '../../../../lib/graphql/mutations/CreateBooking/__generated__/CreateBooking';


interface Props {
    id: string
    price: number;
    checkInDate: Moment;
    checkOutDate: Moment;
    modalVisible: boolean;
    setModalVisible: (modalVisible: boolean) => void;
    clearBookingDate: () => void;
    handleListingRefetch: () => Promise<void>;
}

const { Paragraph, Text, Title } = Typography;

export const ListingCreateBookingModal = ({ 
    modalVisible, 
    setModalVisible,
    checkInDate,
    checkOutDate,
    price,
    id,
    clearBookingDate,
    handleListingRefetch
}:Props) => {
    const [createBooking, { loading }] = useMutation<CreateBookingData, CreateBookingVariables>(CREATE_BOOKING, {
        onCompleted: () => {
            clearBookingDate();
            displaySuccessNotification(
                "You've successfully booked the listing!",
                "Booking history can always be found in your User page."
            );
            handleListingRefetch();
        },
        onError:() => {
            displayErrorMessage("Sorry! We weren't able to successfully book the listing. Please try again later!")
        }
    });

    const daysBooked = checkOutDate.diff(checkInDate, 'days') + 1;
    const listingPrice = price * daysBooked;
    const stripe = useStripe();
    const elements = useElements();

    const handleCreateBooking = async () => {

        if (!stripe || !elements) {
            return displayErrorMessage("Sorry! We weren't able to connect with Stripe.");
        }

        const cardElement = elements.getElement(CardElement);

        if (!cardElement) {
            return displayErrorMessage("Sorry! We couldn't resolve card information.");
        }

        const { token: stripeToken, error } = await stripe.createToken(cardElement);
        if (stripeToken) {
            createBooking({
                variables: {
                    input: {
                        checkIn: moment(checkInDate).format("YYYY-MM-DD"),
                        checkOut: moment(checkOutDate).format("YYYY-MM-DD"),
                        id,
                        source: stripeToken.id,
                    },
                },
            });
        } else {
            displayErrorMessage(
                error && error.message ? error.message : "Sorry! We weren't able to book the listing. Please try again later."
            );
        }
    }

    return (
        <Modal
            visible={modalVisible}
            centered
            footer={null}
            onCancel={() => setModalVisible(false)}
        >
            <div className="listing-booking-modal">
                <div className="listing-booking-modal__intro">
                    <Title className="listing-booking-modal__intro-title">
                        <KeyOutlined/>
                    </Title>
                    <Title level={3} className="listing-booking-modal__intro-title">
                        Book your trip
                    </Title>
                    <Paragraph>
                        Enter your payment information to book the listing from the dates between{" "}
                        <Text mark strong>
                            {moment(checkInDate).format("MMMM Do YYYY")}
                        </Text>{" "}
                        and{" "}
                        <Text mark strong>
                            {moment(checkOutDate).format("MMMM Do YYYY")}
                        </Text>, inclusive.
                    </Paragraph>
                </div>
                <Divider/>
                <div className="listing-booking-modal__charge-summary">
                    <Paragraph >
                        {formatListingPrice(price, false)} * {daysBooked} days ={' '}
                        <Text strong>
                            {formatListingPrice(listingPrice, false)}
                        </Text>
                    </Paragraph>
                    
                    <Paragraph className="listing-booking-modal__charge-summary-total">
                        Total = <Text mark>{formatListingPrice(listingPrice, false)}</Text>
                    </Paragraph>
                </div>
                <Divider/>
                <div className="listing-booking-modal__stripe-card-section">
                    <CardElement className="listing-booking-modal__stripe-card"/>
                    <Button 
                        onClick={handleCreateBooking} 
                        size="large" 
                        type="primary" 
                        className="listing-booking-modal__cta"
                        loading={loading}
                    >
                        Book
                    </Button>
                </div>
            </div>
        </Modal>
    )
}