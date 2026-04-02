import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Button, Tag, Space, Modal, Form, Input, Select, message, Empty, Spin } from 'antd';
import { 
  PlusOutlined, 
  BankOutlined, 
  CreditCardOutlined, 
  DollarOutlined,
  SafetyCertificateOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;
const { Option } = Select;

const AccountsPage = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAccounts();
  }, [user]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/accounts/user/${user.userId}`);
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      message.error('Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (values) => {
    setLoading(true);
    try {
      await api.post('/accounts', {
        userId: user.userId,
        username: user.username,
        accountType: values.accountType
      });
      message.success('New account opened successfully!');
      setIsModalOpen(false);
      form.resetFields();
      fetchAccounts();
    } catch (error) {
      message.error('Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const accountIcons = {
    SAVINGS: <DollarOutlined className="text-4xl text-blue-500" />,
    CURRENT: <BankOutlined className="text-4xl text-green-500" />,
    FIXED_DEPOSIT: <SafetyCertificateOutlined className="text-4xl text-orange-500" />,
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <Title level={2} className="!mb-0">My Bank Accounts</Title>
          <Text type="secondary" className="text-lg">View and manage your different financial portfolios</Text>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large" 
          className="rounded-xl h-12 h-12"
          onClick={() => setIsModalOpen(true)}
        >
          Open New Account
        </Button>
      </div>

      {loading && accounts.length === 0 ? (
        <div className="flex justify-center py-20"><Spin size="large" /></div>
      ) : accounts.length > 0 ? (
        <Row gutter={[24, 24]}>
          {accounts.map((acc, index) => (
            <Col xs={24} md={12} lg={8} key={acc.id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="premium-card relative overflow-hidden h-full">
                   <div className="absolute top-0 right-0 p-6 opacity-10">
                      {accountIcons[acc.accountType] || <BankOutlined className="text-6xl" />}
                   </div>
                   
                   <div className="flex items-start justify-between mb-6">
                      <div className="p-3 bg-gray-50 rounded-2xl">
                        {accountIcons[acc.accountType] || <BankOutlined className="text-2xl text-blue-500" />}
                      </div>
                      <Tag color="success" className="rounded-full px-3 uppercase text-[10px] font-bold tracking-wider">
                        Active
                      </Tag>
                   </div>

                   <div className="mb-6">
                      <Text type="secondary" className="uppercase text-xs font-bold tracking-widest">{acc.accountType.replace('_', ' ')}</Text>
                      <Title level={4} className="!mt-1 !mb-0">{acc.accountNumber}</Title>
                   </div>

                   <div className="flex justify-between items-end">
                      <div>
                        <Text type="secondary" className="text-xs">Available Balance</Text>
                        <Title level={3} className="!mt-0 !mb-0 text-blue-600">Rs. {acc.balance.toLocaleString()}</Title>
                      </div>
                      <Button type="text" className="text-gray-400 group p-0">
                         Manage <ArrowRightOutlined className="group-hover:translate-x-1 transition-transform" />
                      </Button>
                   </div>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      ) : (
        <Empty 
          description="No banking accounts found" 
          className="py-20"
        >
          <Button type="primary" onClick={() => setIsModalOpen(true)}>Create Your First Account</Button>
        </Empty>
      )}

      <Modal
        title={<Title level={3}>Open New Account</Title>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        className="rounded-3xl"
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleCreateAccount} className="mt-4">
          <Form.Item 
            name="accountType" 
            label="Select Account Type" 
            rules={[{ required: true, message: 'Please select an account type' }]}
          >
            <Select size="large" className="rounded-xl overflow-hidden h-12">
              <Option value="SAVINGS">Savings Account</Option>
              <Option value="CURRENT">Current Account</Option>
              <Option value="FIXED_DEPOSIT">Fixed Deposit</Option>
            </Select>
          </Form.Item>
          <div className="bg-blue-50 p-4 rounded-xl mb-6">
             <Text className="text-blue-800 text-sm">
                <PlusOutlined className="mr-2" />
                By opening a new account, you agree to SkyBank's digital banking terms and conditions.
             </Text>
          </div>
          <Form.Item className="mb-0">
            <Button type="primary" htmlType="submit" size="large" block className="rounded-xl h-12 font-bold" loading={loading}>
              Create Account
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AccountsPage;
