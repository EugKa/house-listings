import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import ApolloClient from 'apollo-boost'
import {ApolloProvider} from 'react-apollo'
import {App} from './components/app';
import './styles/index.css'

const client = new ApolloClient({
  uri: '/api',
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById('root')
);

