import React from 'react'
import { List, Skeleton, Card } from "antd";

import listingsLoading from '../../assets/listing-loading-card-cover.jpg'

export const ListingsSkeleton = () => {
    const emtyData = [{}, {}, {}, {},{}, {}, {}, {}]

    return (
        <div className="listings-skeleton">
            <Skeleton paragraph={{ rows: 1 }}/>
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
                dataSource={emtyData}
                renderItem={() => (
                    <List.Item>
                        <Card
                            cover={
                                <div
                                    style={{backgroundImage: `url(${listingsLoading})`}}
                                    className="listings-skeleton__card-cover-img"
                                ></div>
                            }
                            loading
                            className="listings-skeleton__card"
                        />
                    </List.Item>
                )}
            >

            </List>
        </div>
    )
}
