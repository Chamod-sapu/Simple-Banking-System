import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Space } from 'antd';
import { UserOutlined, LockOutlined, BankOutlined, LoadingOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    const result = await login(values.username, values.password);
    setLoading(false);
    
    if (result.success) {
      message.success('Welcome back to SkyBank!');
      navigate('/dashboard');
    } else {
      message.error(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-700 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card 
          className="w-full max-w-md shadow-2xl rounded-3xl overflow-hidden border-none"
          bodyStyle={{ padding: '2.5rem' }}
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-4"
            >
              <BankOutlined className="text-3xl text-blue-600" />
            </motion.div>
            <Title level={2} className="mb-1 !font-bold">Welcome Back</Title>
            <Text type="secondary" className="text-base">Secure login to your personal banking</Text>
          </div>

          <Form
            name="login_form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please enter your username' }]}
            >
              <Input 
                prefix={<UserOutlined className="text-gray-400" />} 
                placeholder="Username" 
                className="rounded-xl h-12"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Password"
                className="rounded-xl h-12"
              />
            </Form.Item>

            <div className="flex justify-between items-center mb-6">
              <Link to="/register" className="text-blue-600 font-medium hover:underline">
                New to SkyBank? Register
              </Link>
            </div>

            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-12 text-base font-bold rounded-xl"
                loading={loading}
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
