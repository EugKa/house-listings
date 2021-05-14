import React from 'react';
import { Route, Switch } from 'react-router';
import { Home } from '../Home';
import { Host } from '../Host';
import { Listing } from '../Listing';
import { Listings } from '../Listings';
import { NotFound } from '../NotFound';
import { User } from '../User';

export function App() {
  return (
    <div className="App">
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route exact path="/host" component={Host}/>
          <Route exact path="/listing/:id" component={Listing}/>
          <Route exact path="/listings/:location?" component={Listings}/>
          <Route exact path="/user/:id" component={User}/>
          <Route component={NotFound}/>
        </Switch>
    </div>
  );
}


