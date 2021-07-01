import React, {useState, useEffect, useRef} from 'react';
import { Route, Switch } from 'react-router';
import { Home } from '../Home';
import { Host } from '../Host';
import { Listing } from '../Listing';
import { Listings } from '../Listings';
import { Login } from '../Login';
import { NotFound } from '../NotFound';
import { User } from '../User';
import { Affix, Layout, Spin } from "antd";
import { Viewer } from "../../lib/types";
import { AppHeader } from '../Header';
import { AppHeaderSkeleton, ErrorBanner } from '../../lib/components'
import '../../styles/index.css'
import { useMutation } from '@apollo/react-hooks';
import { LOG_IN } from '../../lib/graphql/mutations';
import { LogIn as LogInData, LogInVariables } from '../../lib/graphql/mutations/LogIn/__generated__/LogIn';
import { Stripe } from '../Stripe';
import {loadStripe} from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const initialViewer: Viewer = {
  id: null,
  token: null,
  avatar: null,
  hasWallet: null,
  didRequest: false
}

export function App() {
  const [viewer, setViewer] = useState<Viewer>(initialViewer)
  const [logIn, { error }] = useMutation<LogInData, LogInVariables>(LOG_IN, {
    onCompleted: data => {
      if(data && data.logIn) {
        setViewer(data.logIn)

        if(data.logIn.token) {
          sessionStorage.setItem("token", data.logIn.token)
        } else {
          sessionStorage.removeItem("token")
        }
      }
    }
  })
  const logInRef = useRef(logIn)

  useEffect(() => {
    logInRef.current()
  },[])

  if(!viewer.didRequest && !error) {
    return (
      <Layout className="app-skeleton">
        <AppHeaderSkeleton/>
        <div className="app-skeleton__spin-section">
          <Spin size="large" tip="Launching TinyHouse"/>
        </div>
      </Layout>
    )
    
  }

  const logInErrorBannerElement = error ? <ErrorBanner description="We weren't able to veritfy if you were logged in. Please try again later"/> : null;
  const stripePromise = loadStripe(process.env.REACT_APP_S_PUBL_KEY_TEST as string)

  return (
    <Elements stripe={stripePromise}>
      <Layout id="app">
        {logInErrorBannerElement}
        <Affix offsetTop={0} className="app__affix-header">
          <AppHeader viewer={viewer} setViewer={setViewer}/>
        </Affix>
          <Switch>
            <Route exact path="/">
              <Home/>
            </Route>
            <Route exact path="/host">
              <Host viewer={viewer}/>
            </Route>
            <Route exact path="/listing/:id">
              <Listing viewer={viewer}/>
            </Route>
            <Route exact path="/listings/:location?" component={Listings}/>
            <Route exact path="/login">
              <Login setViewer={setViewer}/>
            </Route>
            <Route exact path="/stripe">
              <Stripe viewer={viewer} setViewer={setViewer}/>
            </Route>
            <Route exact path="/user/:id">
              <User viewer={viewer} setViewer={setViewer}/>
            </Route>
            <Route component={NotFound}/>
          </Switch>
      </Layout>
    </Elements>
  );
}


