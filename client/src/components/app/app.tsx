import React from 'react';
import { Route, Switch } from 'react-router';
import { Home } from '../Home';
import { Host } from '../Host';
import { Listing } from '../Listing';
import { Listings } from '../Listings';
import { Login } from '../Login';
import { NotFound } from '../NotFound';
import { User } from '../User';
import { Layout } from "antd";
import '../../styles/index.css'

export function App() {
  return (
    <Layout id="app">
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route exact path="/host" component={Host}/>
          <Route exact path="/listing/:id" component={Listing}/>
          <Route exact path="/listings/:location?" component={Listings}/>
          <Route exact path="/login" component={Login}/>
          <Route exact path="/user/:id" component={User}/>
          <Route component={NotFound}/>
        </Switch>
    </Layout>
  );
}


