import React, { useEffect, useRef } from 'react'
import { Layout, Spin } from 'antd'
import { useMutation } from '@apollo/react-hooks';
import { CONNECT_STRIPE } from '../../lib/graphql/mutations';
import { ConnectStripe as ConnectStripeData ,ConnectStripeVariables } from '../../lib/graphql/mutations/ConnectStripe/__generated__/ConnectStripe';
import { Redirect, RouteComponentProps } from 'react-router';
import { Viewer } from '../../lib/types';
import { displaySuccessNotification } from '../../lib/utils';

interface Props {
    viewer: Viewer;
    setViewer: (viewer: Viewer) => void
}
 
const { Content } = Layout;
export const Stripe = ({ viewer, setViewer, history}: Props & RouteComponentProps) => {
    const [connectStripe, { data, loading, error }] = useMutation<
        ConnectStripeData,
        ConnectStripeVariables
    >(CONNECT_STRIPE, {
        onCompleted: data => {
            if(data && data.connectStripe) {
                setViewer({...viewer, hasWallet: data.connectStripe.hasWallet});
                displaySuccessNotification(
                    "You've successfully connected your Stripe Account!",
                    " You can how begin to create listings in the Host page.")
            }
        }
    })
    console.log(`data`, data)
    console.log(`viewer`, viewer)
    console.log(`history`, history)
    const connectStripeRef = useRef(connectStripe)
    console.log(`connectStripeRef`, connectStripeRef)
    useEffect(() => {
       const code = new URL(window.location.href).searchParams.get("code")
       console.log(`code`, code)
       if(code) {
           connectStripeRef.current({
               variables: {
                   input: { code }
               }
           })
        } else {
            history.replace("/login")
        }
    }, [history])

    if(data && data.connectStripe) {
        return <Redirect to={`/user/${viewer.id}`}/>
    }

    if(loading) {
        return (
            <Content>
                <Spin size="large" tip="Connecting your Stripe account..."/>
            </Content>
        )
    }

    if(error) {
        return <Redirect to={`/user/${viewer.id}?stripe_error=true`}/>
    }
    
    return null;
}
