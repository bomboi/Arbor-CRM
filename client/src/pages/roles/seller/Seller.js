import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Layout, Menu, Spin, Button, Drawer } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  UserOutlined,
  AppstoreOutlined,
  ContainerOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useHistory } from "react-router-dom";
import MenuSwitch from '../MenuSwitch';
import Auth from '../../../routing/Auth';
import Axios from 'axios';
import { isAdmin, loggedInUser } from '@selectors/appSelectors';
import { userSlice } from '@reducers/appReducers';
import { logout } from '../../../Redux/actions';
import { isBrowser, MobileView, BrowserView } from 'react-device-detect';
import { orderDefaultsSlice } from '../../../Redux/reducers/appReducers';

const { Content, Sider } = Layout;

const Seller = (props) => {

  let history = useHistory();
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(history.location.pathname.substring(1));
  const [openDrawer, setOpenDrawer] = useState(false);

  useEffect(() => {
    Axios.get('/api/user/get')
      .then(result => {
        props.dispatch(userSlice.actions.initUser(result.data));
        setTimeout(() => {
          setLoading(false);
        }, 10);
      })
    Axios.get('/api/setting/order-defaults').then(res => props.dispatch(orderDefaultsSlice.actions.init(res.data)));
  }, []);

  const menuFunction = ({ item, key, keyPath, domEvent }) => {
    setSelected(key);
    switch (key) {
      case 'logout':
        props.dispatch(logout());
        Auth.logout(history);
        break;
      default:
        history.push('/' + key);
        break;
    }
  };

  return (
      loading?
        <div className="h-100 d-flex justify-content-center align-items-center"><Spin tip="Ucitavanje..."/></div>
      :
      // TODO: Make Sider independent of content
      <>
        <Layout style={{ minHeight: '100vh' }} hasSider={isBrowser}>
        <BrowserView>
          <Sider 
            collapsible={true}
            defaultCollapsed={true}
            theme="light" 
            style={{
            height: '100vh',
          }}>
            <div className="logo" />
            <Menu selectedKeys={[selected]} mode="inline" onSelect={menuFunction}>
              <Menu.Item key="porudzbine" icon={<ContainerOutlined />}>
                Porudzbine
              </Menu.Item>
              <Menu.Item key="kupci" icon={<UserOutlined />}>
                Kupci
              </Menu.Item>
              <Menu.Item key="proizvodi" icon={<AppstoreOutlined />}>
                Proizvodi
              </Menu.Item>
              <Menu.Item key="podesavanja" icon={<SettingOutlined />}>
                Podesavanja
              </Menu.Item>
              {props.isAdmin && <Menu.Item key="statistika" icon={<PieChartOutlined />}>
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
        
        <Layout className="site-layout">
          <MobileView>
          <Button 
            style={{
              width: "100%"
            }} 
            size='large'
            onClick={() => setOpenDrawer(!openDrawer)} 
            type="primary">
              Meni
          </Button>
            <Drawer
              bodyStyle={{
                padding: 0,
                width: "100%"
              }}
              placement="left"
              closable={false}
              onClose={() => console.log("bruh")}
              getContainer={false}
              visible={openDrawer}>
              <Button 
                style={{
                  width: "100%"
                }} 
                size='large'
                onClick={() => setOpenDrawer(!openDrawer)} 
                type="primary">
                  Zatvori
              </Button>
              <Menu 
                style={{
                  width: "100%",
                  height: "100%"
                }} 
                selectedKeys={[selected]} 
                mode="inline" 
                onSelect={menuFunction}>
                    <Menu.Item key="porudzbine" icon={<ContainerOutlined />}>
                      Porudzbine
                    </Menu.Item>
                    <Menu.Item key="kupci" icon={<UserOutlined />}>
                      Kupci
                    </Menu.Item>
                    <Menu.Item key="proizvodi" icon={<AppstoreOutlined />}>
                      Proizvodi
                    </Menu.Item>
                    <Menu.Item key="podesavanja" icon={<SettingOutlined />}>
                      Podesavanja
                    </Menu.Item>
                    {props.isAdmin && <Menu.Item key="statistika" icon={<PieChartOutlined />}>
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
            </Drawer>
          </MobileView>
          <Content style={{ margin: '10px 16px 0px 16px' }} className='h-100'>
                <MenuSwitch/>
          </Content>
        </Layout>
      </Layout>
    </>
  )
}

const mapStateToProps = (state) => ({
    isAdmin: isAdmin(state),
    loggedInUser: loggedInUser(state)
})

export default connect(mapStateToProps)(Seller);