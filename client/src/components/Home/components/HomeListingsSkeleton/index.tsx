import React from 'react'
import { List, Card, Skeleton } from 'antd'

import listingLoadingCardCover from '../../assets/listing-loading-card-cover.jpg'


export const HomeListingsSkeleton = () => {
    const emtyData = [{}, {}, {}, {}]

    return (
        <div className="home-listings-skeleton">
            <Skeleton paragraph={{ rows: 0 }}/>
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
                                    style={{backgroundImage: `url(${listingLoadingCardCover})`}}
                                    className="home-listings-skeleton__card-cover-img"
                                ></div>
                            }
                            loading
                        />
                    </List.Item>
                )}
            >

            </List>
        </div>
    )
}


