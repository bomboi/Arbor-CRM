import React, { Component } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';
import { Provider } from 'react-redux'
import reduxStore from './Redux/store';
import AppRouter from './routing/AppRouter';


class App extends Component {

  render() {
    return (
      <Provider store={reduxStore}>
        <AppRouter/>
      </Provider>
    )
  }
}
export default App