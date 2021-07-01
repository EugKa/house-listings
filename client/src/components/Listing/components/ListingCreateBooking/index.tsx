import React from 'react'
import { Button, Card, Divider, Typography, DatePicker, Tooltip } from 'antd'
import moment, { Moment } from 'moment'
import { formatListingPrice, displayErrorMessage } from '../../../../lib/utils';
import { Viewer } from '../../../../lib/types';
import { Listing as ListingData } from '../../../../lib/graphql/queries/Listing/__generated__/Listing';
import { BookingsIndex } from './types';

const { Paragraph, Title, Text } = Typography;

interface Props {
    host: ListingData['listing']['host']
    viewer: Viewer;
    price: number;
    bookingsIndex: ListingData['listing']['bookingsIndex']
    checkInDate: Moment | null;
    checkOutDate: Moment | null;
    setCheckInDate: (checkInDate: Moment | null) => void;
    setCheckOutDate: (checkOutDate: Moment | null) => void;
    setModalVisible: (modalVisible: boolean) => void;
}

export const ListingCreateBooking = ({
    bookingsIndex,
    viewer,
    host,
    price, 
    checkInDate, 
    checkOutDate, 
    setCheckInDate, 
    setCheckOutDate,
    setModalVisible
}: Props) => {
    const bookingsIndexJSON: BookingsIndex = JSON.parse(bookingsIndex);

    const dateIsBooked = (currentDate: Moment) => {
        const year = moment(currentDate).year();
        const month = moment(currentDate).month();
        const day = moment(currentDate).day();

        if(bookingsIndexJSON[year] && bookingsIndexJSON[year][month]) {
            return Boolean(bookingsIndexJSON[year][month][day])
        } else {
            return false
        }
    }

    const disabledDate = (currentDate?: Moment) => {
        if(currentDate) {
            const dateIsBeforeEndOfDay = currentDate.isBefore(moment().endOf('day'));
            const dateIsMoreThanThreeMonthsAhead = moment(currentDate).isAfter(
                moment()
                  .endOf("day")
                  .add(90, "days")
              );
            return (
                dateIsBeforeEndOfDay || 
                dateIsMoreThanThreeMonthsAhead || 
                dateIsBooked(currentDate)
            );
        } else {
            return false;
        }
    }

    const verifyAndSetCheckOutDate = (selectedCheckOutDate:Moment | null) => {
        if(selectedCheckOutDate && checkInDate) {
            if(moment(selectedCheckOutDate).isBefore(checkInDate, 'days')) {
                return displayErrorMessage(`You can't book date of check out to be prior to check in!`)
            }
            let dateCursor = checkInDate;

            while(moment(dateCursor).isBefore(selectedCheckOutDate, 'days')) {
                dateCursor = moment(dateCursor).add(1, 'days');

                const year = moment(dateCursor).year();
                const month = moment(dateCursor).month();
                const day = moment(dateCursor).day();

                if(bookingsIndexJSON[year] && 
                    bookingsIndexJSON[year][month] && 
                    bookingsIndexJSON[year][month][day]) {
                    return displayErrorMessage(
                        "You can't book a period of time that overlaps existing bookings. Plase try againg!"
                    )
                }
            }
        }
        setCheckOutDate(selectedCheckOutDate)
    } 

    const viewerIsHost = viewer.id === host.id;
    const checkInInputDisabled = !viewer.id || viewerIsHost || !host.hasWallet;
    const checkOutInputDisabled = checkInInputDisabled || !checkInDate;
    const buttonDisabled = checkInInputDisabled || !checkInDate || !checkOutDate;

    let buttonMessage = "You won't be changed yet";
    if(!viewer.id) {
        buttonMessage = 'You have to be signed in to book a listing!'
    } else if (viewerIsHost) {
        buttonMessage = "You can't book your own listing!"
    } else if (!host.hasWallet) {
        buttonMessage = "The host has disconnected from Stripe and thus won't be able to receive payments!"
    }

    return (
        <div className="listing-booking">
            <Card className="listing-booking__card">
                <div>
                    <Paragraph>
                        <Title className="listing-booking__card-title" level={2}>
                            {formatListingPrice(price)}
                            <span>/day</span>
                        </Title>
                    </Paragraph>
                    <Divider/>
                    <div className="listing-booking__card-date-picker">
                        <Paragraph strong>Check In</Paragraph>
                        <DatePicker 
                            disabled={checkInInputDisabled}
                            value={checkInDate ? checkInDate : undefined} 
                            onChange={dateValue => setCheckInDate(dateValue)}
                            disabledDate={disabledDate}
                            format={"YYYY/MM/DD"}
                            showToday={false}
                            onOpenChange={() => setCheckOutDate(null)}
                            renderExtraFooter={() => {
                                return (
                                  <div>
                                    <Text type="secondary" className="ant-calendar-footer-text">
                                      You can only book a listing within 90 days from today.
                                    </Text>
                                  </div>
                                );
                              }}
                        />
                    </div>
                    <div className="listing-booking__card-date-picker">
                        <Paragraph strong>Check Out</Paragraph>
                        <DatePicker 
                            value={checkOutDate}
                            onChange={dateValue => verifyAndSetCheckOutDate(dateValue)}
                            disabledDate={disabledDate}
                            format={"YYYY/MM/DD"}
                            showToday={false}
                            disabled={checkOutInputDisabled}
                            dateRender={current => {
                                if (
                                  moment(current).isSame(checkInDate ? checkInDate : undefined, "day")
                                ) {
                                  return (
                                    <Tooltip title="Check in date">
                                      <div className="ant-calendar-date ant-calendar-date__check-in">
                                        {current.date()}
                                      </div>
                                    </Tooltip>
                                  );
                                } else {
                                  return <div className="ant-calendar-date">{current.date()}</div>;
                                }
                              }}
                              renderExtraFooter={() => {
                                return (
                                  <div>
                                    <Text type="secondary" className="ant-calendar-footer-text">
                                      Check-out cannot be before check-in.
                                    </Text>
                                  </div>
                                );
                              }}
                        />
                    </div>
                </div>
                <Divider/>
                <Button 
                    disabled={buttonDisabled} 
                    size="large" 
                    type="primary" 
                    className="listing-booking__card-cta"
                    onClick={() => setModalVisible(true)}
                >
                    Request to book!
                </Button>
                <Text type="secondary" mark>
                    {buttonMessage}
                </Text>
            </Card>
        </div>
    )
}
