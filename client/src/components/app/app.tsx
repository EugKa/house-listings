import React, {useState} from 'react';
import { Route, Switch } from 'react-router';
import { Home } from '../Home';
import { Host } from '../Host';
import { Listing } from '../Listing';
import { Listings } from '../Listings';
import { Login } from '../Login';
import { NotFound } from '../NotFound';
import { User } from '../User';
import { Affix, Layout } from "antd";
import { Viewer } from "../../lib/types";
import '../../styles/index.css'
import { AppHeader } from '../Header';

const initialViewer: Viewer = {
  id: null,
  token: null,
  avatar: null,
  hasWallet: null,
  didRequest: false
}

export function App() {
  const [viewer, setViewer] = useState<Viewer>(initialViewer)
  console.log(viewer);
  
  return (
    <Layout id="app">
      <Affix offsetTop={0} className="app__affix-header">
        <AppHeader viewer={viewer} setViewer={setViewer}/>
      </Affix>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route exact path="/host" component={Host}/>
          <Route exact path="/listing/:id" component={Listing}/>
          <Route exact path="/listings/:location?" component={Listings}/>
          <Route exact path="/login" render={props =><Login {...props} setViewer={setViewer}/>}/>
          <Route exact path="/user/:id" component={User}/>
          <Route component={NotFound}/>
        </Switch>
    </Layout>
  );
}


