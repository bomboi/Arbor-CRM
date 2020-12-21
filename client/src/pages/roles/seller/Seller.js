import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Layout, Menu, Spin } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { useHistory } from "react-router-dom";
import MenuSwitch from '../MenuSwitch';
import Auth from '../../../routing/Auth';
import Axios from 'axios';
import { isAdmin, loggedInUser } from '@selectors/appSelectors';
import { userSlice } from '@reducers/appReducers';
import { logout } from '../../../Redux/actions';
import { isBrowser, MobileView, BrowserView } from 'react-device-detect';
import { NavBar } from 'antd-mobile';

const { Content, Sider } = Layout;

const Seller = (props) => {

  let history = useHistory();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Axios.get('/api/user/get')
      .then(result => {
        console.log('INIT_USER')
        props.dispatch(userSlice.actions.initUser(result.data));
        setTimeout(() => {
          setLoading(false);
        }, 10);
      })
  }, []);

  const menuFunction = ({ item, key, keyPath, domEvent }) => {
    switch (key) {
      case 'logout':
        props.dispatch(logout());
        Auth.logout(history);
        break;
      default:
        console.log('push')
        history.push('/' + key);
        break;
    }
  };

  console.log(history)
  return (
      loading?
        <div className="h-100 d-flex justify-content-center align-items-center"><Spin tip="Ucitavanje..."/></div>
      :
      // TODO: Make Sider independent of content
      <Layout style={{ minHeight: '100vh' }} hasSider={isBrowser}>
      <BrowserView>
        <Sider theme="light" style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
        }}>
          <div className="logo" />
          <Menu defaultSelectedKeys={['porudzbine']} mode="inline" onSelect={menuFunction}>
            <Menu.Item key="porudzbine" icon={<PieChartOutlined />}>
              Porudzbine
            </Menu.Item>
            <Menu.Item key="kupci" icon={<DesktopOutlined />}>
              Kupci
            </Menu.Item>
            <Menu.Item key="proizvodi" icon={<DesktopOutlined />}>
              Proizvodi
            </Menu.Item>
            <Menu.Item key="podesavanja" icon={<DesktopOutlined />}>
              Podesavanja
            </Menu.Item>
            {props.isAdmin && <Menu.Item key="statistika" icon={<DesktopOutlined />}>
              Statistika
            </Menu.Item>}
            {/* TODO: Put name and logout on the lower end of sider */}
            <Menu.Item>
              {props.loggedInUser.firstName}
            </Menu.Item>
            <Menu.Item key="logout" icon={<DesktopOutlined />}>
              Izloguj se
            </Menu.Item>
          </Menu>
        </Sider>
      </BrowserView>
      
      <Layout style={{ marginLeft: isBrowser?200:0 }} className="site-layout">
        <Content style={{ margin: '10px 16px 0px 16px' }} className='h-100'>
              <MenuSwitch/>
        </Content>
      </Layout>
    </Layout>
  )
}

const mapStateToProps = (state) => ({
    isAdmin: isAdmin(state),
    loggedInUser: loggedInUser(state)
})

export default connect(mapStateToProps)(Seller);