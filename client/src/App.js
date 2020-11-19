import React, { Component } from 'react'
import './App.css'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Login from './pages/Login/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';
import Seller from './pages/roles/seller/Seller';
import { store, collect } from 'react-recollect';
import ProtectedRoute from './routing/ProtectedRoute';
import { Provider } from 'react-redux'
import reduxStore from './Redux/store';

store.pages = {
        orders: {
          orderDetails: {
            addArticle: {
              current:{},
            },
            articles: []
          }
        },
        products: {
          productsList: {
            selected:[]
          }
        }
      }


class App extends Component {

  render() {
    return (
      <Provider store={reduxStore}>
        <Router>
          <Switch>
            <Route path='/login'>
              <Login />
            </Route>
            <ProtectedRoute path="/">
              <Seller />
            </ProtectedRoute>
          </Switch>
        </Router>
      </Provider>
    )
  }
}
export default collect(App)