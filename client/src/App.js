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
import ProtectedRoute from './routing/ProtectedRoute';
import { Provider } from 'react-redux'
import reduxStore from './Redux/store';


class App extends Component {

  render() {
    return (
      <Provider store={reduxStore}>
        <Router>
          <Switch>
            <ProtectedRoute login path='/login'>
              <Login />
            </ProtectedRoute>
            <ProtectedRoute path="/">
              <Seller />
            </ProtectedRoute>
          </Switch>
        </Router>
      </Provider>
    )
  }
}
export default App