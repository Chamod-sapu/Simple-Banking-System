import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Space, Typography } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  HistoryOutlined,
  UserOutlined,
  LogoutOutlined,
  BankOutlined,
  SwapOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <PieChartOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/accounts',
      icon: <BankOutlined />,
      label: 'My Accounts',
    },
    {
      key: '/transfer',
      icon: <SwapOutlined />,
      label: 'Transfer',
    },
    {
      key: '/history',
      icon: <HistoryOutlined />,
      label: 'Activity',
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenuItems = {
    items: [
      {
        key: 'profile',
        label: 'My Profile',
        icon: <UserOutlined />,
      },
      {
        key: 'logout',
        label: 'Sign Out',
        icon: <LogoutOutlined />,
        onClick: handleLogout,
        danger: true,
      },
    ],
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)}
        theme="dark"
        className="shadow-2xl z-10"
      >
        <div className="flex items-center justify-center py-6 px-4">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-3"
          >
            <BankOutlined className="text-2xl text-blue-400" />
            {!collapsed && (
              <span className="text-xl font-bold text-white tracking-tight">SkyBank</span>
            )}
          </motion.div>
        </div>
        <Menu 
          theme="dark" 
          defaultSelectedKeys={[location.pathname]} 
          mode="inline" 
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          className="mt-4"
        />
      </Sider>
      <Layout className="bg-gray-50">
        <Header className="bg-white px-8 flex items-center justify-between shadow-sm sticky top-0 z-10 h-16">
          <div className="flex items-center gap-4">
             <Title level={4} style={{ margin: 0, fontWeight: 600 }}>
               {menuItems.find(item => item.key === location.pathname)?.label || 'SkyBank'}
             </Title>
          </div>
          <div className="flex items-center gap-6">
            <Text type="secondary" className="hidden sm:inline">
              Welcome back, <span className="font-semibold text-gray-800">{user?.username}</span>
            </Text>
            <Dropdown menu={userMenuItems} placement="bottomRight" arrow>
              <Avatar 
                size="large" 
                style={{ backgroundColor: '#1677ff', cursor: 'pointer' }}
                icon={<UserOutlined />}
              />
            </Dropdown>
          </div>
        </Header>
        <Content className="p-8 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </Content>
        <Footer style={{ textAlign: 'center', background: 'transparent' }} className="text-gray-400 text-xs">
          SkyBank ©{new Date().getFullYear()} Modern Distributed Cloud Banking System
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
