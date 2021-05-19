import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { USER } from '../../lib/graphql/queries'
import { User as UserData, UserVariables } from '../../lib/graphql/queries/User/__generated__/User'
import { RouteComponentProps } from 'react-router'
import { Col, Row, Layout } from "antd";
import { UserProfile } from "./components";
import { Viewer } from '../../lib/types'
import { ErrorBanner, PageSkeleton } from '../../lib/components'

interface MatchParams {
    id: string
}
interface Props {
    viewer: Viewer
}

const {Content} = Layout

export const User = ({match, viewer}:Props & RouteComponentProps<MatchParams>) => {
    const { data, loading, error } = useQuery<UserData, UserVariables>(USER, {
        variables : {
            id: match.params.id,
            
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

    const userProfileElement = user ? <UserProfile user={user} viewerIsUser={viewerIsUser}/> : null;
    return (
        <Content className="user">
            <Row gutter={12}  justify="space-between">
                <Col xs={24}>{userProfileElement}</Col>
            </Row>
        </Content>
    )
}
