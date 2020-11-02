import React, {useState} from 'react'
import { Layout, Menu, Breadcrumb } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
    Switch,
    Route
  } from "react-router-dom";
import Invoice from '../../Invoice/Invoice';
import { useRouteMatch, useHistory } from "react-router-dom";
import Orders from '../../Orders/Orders';
import Customers from '../../Customers/Customers';
import Products from '../../Products/Products';
import MenuSwitch from '../MenuSwitch';
import Auth from '../../../routing/Auth';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const Seller = () => {

  let history = useHistory();

  const menuFunction = ({ item, key, keyPath, domEvent }) => {
    switch (key) {
      case 'logout':
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
      <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="light">
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
          <Menu.Item key="logout" icon={<DesktopOutlined />}>
            Izloguj se
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Content style={{ margin: '10px 16px 0px 16px' }} className='h-100'>
              <MenuSwitch/>
        </Content>
      </Layout>
    </Layout>
  )
}

export default Seller;