import React, { useState, useEffect, useRef } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { Layout, List, Typography, Affix } from "antd";
import { ListingCard, ErrorBanner } from "../../lib/components";
import { LISTINGS } from '../../lib/graphql/queries'

import { ListingsFilter } from '../../lib/graphql/globalTypes';
import { Listings as ListingsData, ListingsVariables } from '../../lib/graphql/queries/Listings/__generated__/Listings';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { ListingsFilters, ListingsPagination, ListingsSkeleton } from './components';
import { useScrollToTop } from '../../lib/hooks';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const PAGE_LIMIT = 8; 

interface MatchParams {
    location: string;
}

export const Listings = ({ match }: RouteComponentProps<MatchParams>) => {
    const locationRef = useRef(match.params.location)
    const [filter, setFilter] = useState(ListingsFilter.PRICE_LOW_TO_HIGH)
    const [page, setPage] = useState(1)
    const { data, loading, error } = useQuery<ListingsData, ListingsVariables>(LISTINGS, {
        skip: locationRef.current !== match.params.location && page !== 1,
        variables: {
            location: match.params.location,
            filter,
            limit: PAGE_LIMIT,
            page
        }
    })

    useScrollToTop();

    useEffect(() => {
        setPage(1) 
        locationRef.current = match.params.location
    }, [match.params.location])

    if(loading) {
        return (
            <Content className="listings">
                <ListingsSkeleton/>
            </Content>
        )
    }

    if(error) {
        return (
            <Content className="listings">
                <ErrorBanner description="We either couldn't find anything mathing your search or have encoutered an error. If you're searching for a unique location, try searching againg with more common keywords."/>
                <ListingsSkeleton/>
            </Content>
        )
    }
 
    const listings = data ? data.listings : null;
    const listingsRegion = listings ? listings.region : null;

    const listingsSectionElement =
        listings && listings.result.length ? (
            <div>
                <Affix offsetTop={64}>
                    <div>
                        <ListingsPagination
                            total={listings.total}
                            page={page}
                            limit={PAGE_LIMIT}
                            setPage={setPage}
                        />
                        <ListingsFilters filter={filter} setFilter={setFilter}/>
                    </div>
                </Affix>
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
                    dataSource={listings.result}
                    renderItem={listing => (
                        <List.Item>
                            <ListingCard listing={listing}/>
                        </List.Item>
                    )}
                />
            </div>  
    ) : (
            <div>
                <Paragraph>
                    It appers that no listings have yet been created for{" "}
                    <Text mark>"{listingsRegion}"</Text>
                </Paragraph>
                <Paragraph>
                    Be the first person to create a <Link to="/host">listing in this area</Link>!
                </Paragraph>
            </div>
        );

    const listingsRegionElement = listingsRegion ? (
        <Title level={3} className="listings__title">Results for "{listingsRegion}"</Title>
    ) : null;

    return (
        <Content className="listings">
            {listingsRegionElement}
            {listingsSectionElement}
        </Content>
    )
}
