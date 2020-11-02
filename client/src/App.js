import React, { Component } from 'react'
import './App.css'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Login from './pages/Login/Login';
import Invoice from './pages/Invoice/Invoice';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';
import Seller from './pages/roles/seller/Seller';
import { store, collect } from 'react-recollect';
import ProtectedRoute from './routing/ProtectedRoute';

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
    )
  }
}
export default collect(App)