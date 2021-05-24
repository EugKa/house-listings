import React from 'react'
import { Button, Card, Divider, Typography, DatePicker } from 'antd'
import moment, { Moment } from 'moment'
import { formatListingPrice, displayErrorMessage } from '../../../../lib/utils';

const { Paragraph, Title } = Typography;

interface Props {
    price: number;
    checkInDate: Moment | null;
    checkOutDate: Moment | null;
    setCheckInDate: (checkInDate: Moment | null) => void;
    setCheckOutDate: (checkOutDate: Moment | null) => void;
}

export const ListingCreateBooking = ({
    price, 
    checkInDate, 
    checkOutDate, 
    setCheckInDate, 
    setCheckOutDate
}: Props) => {

    const disabledDate = (cuttentDate?: Moment) => {
        if(cuttentDate) {
            const dateIsBeforeEndOfDay = cuttentDate.isBefore(moment().endOf('day'));
            return dateIsBeforeEndOfDay;
        } else {
            return false;
        }
    }

    const verifyAndSetCheckOutDate = (selectedCheckOutDate:Moment | null) => {
        if(selectedCheckOutDate && checkInDate) {
            if(moment(selectedCheckOutDate).isBefore(checkInDate, 'days')) {
                return displayErrorMessage(`You can't book date of check out to be prior to check in!`)
            }
        }
        setCheckOutDate(selectedCheckOutDate)
    } 

    const checkOutInputDisabled = !checkInDate;
    const buttonDisabled = !checkInDate || !checkOutDate

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
                            value={checkInDate} 
                            onChange={dateValue => setCheckInDate(dateValue)}
                            disabledDate={disabledDate}
                            format={"YYYY/MM/DD"}
                            showToday={false}
                            onOpenChange={() => setCheckOutDate(null)}
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
                        />
                    </div>
                </div>
                <Divider/>
                <Button disabled={buttonDisabled} size="large" type="primary" className="listing-booking__card-cta">
                    Request to book!
                </Button>
            </Card>
        </div>
    )
}
