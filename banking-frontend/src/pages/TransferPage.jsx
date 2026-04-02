import React, { useState, useEffect } from 'react';
import { Card, Tabs, Form, Input, Button, Select, InputNumber, message, Typography, Row, Col, Alert, Divider } from 'antd';
import { 
  SwapOutlined, 
  ArrowDownOutlined, 
  ArrowUpOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const TransferPage = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formTransfer] = Form.useForm();
  const [formDeposit] = Form.useForm();
  const [formWithdraw] = Form.useForm();

  useEffect(() => {
    fetchAccounts();
  }, [user]);

  const fetchAccounts = async () => {
    try {
      const response = await api.get(`/accounts/user/${user.userId}`);
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const onTransfer = async (values) => {
    setLoading(true);
    try {
      const response = await api.post('/transactions/transfer', {
        fromAccountId: values.fromAccountId,
        toAccountId: values.toAccountId, // In a real app, this might be an account number
        amount: values.amount,
        description: values.description
      });

      if (response.data.status === 'SUCCESS') {
        message.success('Transfer successful!');
        formTransfer.resetFields();
        fetchAccounts();
      } else {
        message.error(`Transfer failed: ${response.data.failureReason}`);
      }
    } catch (error) {
      message.error('An error occurred during transfer');
    } finally {
      setLoading(false);
    }
  };

  const onDeposit = async (values) => {
    setLoading(true);
    try {
      const response = await api.post('/transactions/deposit', {
        accountId: values.accountId,
        amount: values.amount,
        description: values.description
      });

      if (response.data.status === 'SUCCESS') {
        message.success('Deposit successful!');
        formDeposit.resetFields();
        fetchAccounts();
      } else {
        message.error(`Deposit failed: ${response.data.failureReason}`);
      }
    } catch (error) {
      message.error('An error occurred during deposit');
    } finally {
      setLoading(false);
    }
  };

  const onWithdraw = async (values) => {
    setLoading(true);
    try {
      const response = await api.post('/transactions/withdraw', {
        accountId: values.accountId,
        amount: values.amount,
        description: values.description
      });

      if (response.data.status === 'SUCCESS') {
        message.success('Withdrawal successful!');
        formWithdraw.resetFields();
        fetchAccounts();
      } else {
        message.error(`Withdrawal failed: ${response.data.failureReason}`);
      }
    } catch (error) {
      message.error('An error occurred during withdrawal');
    } finally {
      setLoading(false);
    }
  };

  const tabItems = [
    {
      key: 'transfer',
      label: (
        <span className="flex items-center gap-2 px-4">
          <SwapOutlined /> Transfer Funds
        </span>
      ),
      children: (
        <Form form={formTransfer} onFinish={onTransfer} layout="vertical" className="mt-4">
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item name="fromAccountId" label="From Account" rules={[{ required: true }]}>
                <Select placeholder="Select source account" className="rounded-lg h-10">
                  {accounts.map(acc => (
                    <Option key={acc.id} value={acc.id}>
                      {acc.accountType} (****{acc.accountNumber.slice(-4)}) - Rs. {acc.balance.toLocaleString()}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="toAccountId" label="Recipient Account ID" rules={[{ required: true }]}>
                <Input placeholder="Enter recipient's system ID" className="rounded-lg h-10" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="amount" label="Amount (Rs.)" rules={[{ required: true, type: 'number', min: 1 }]}>
                <InputNumber 
                  className="w-full rounded-lg h-10 flex items-center" 
                  placeholder="Enter amount"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="description" label="Remarks (Optional)">
                <Input placeholder="What is this for?" className="rounded-lg h-10" />
              </Form.Item>
            </Col>
          </Row>
          <div className="mt-4 flex justify-end">
            <Button type="primary" htmlType="submit" size="large" icon={<SwapOutlined />} loading={loading} className="rounded-xl px-10 h-12">
              Confirm Transfer
            </Button>
          </div>
        </Form>
      )
    },
    {
      key: 'deposit',
      label: (
        <span className="flex items-center gap-2 px-4">
          <ArrowUpOutlined className="text-green-500" /> Deposit
        </span>
      ),
      children: (
        <Form form={formDeposit} onFinish={onDeposit} layout="vertical" className="mt-4 max-w-lg">
          <Form.Item name="accountId" label="Target Account" rules={[{ required: true }]}>
            <Select placeholder="Select account to deposit to" className="rounded-lg h-10">
              {accounts.map(acc => (
                <Option key={acc.id} value={acc.id}>
                  {acc.accountType} (****{acc.accountNumber.slice(-4)})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="amount" label="Amount (Rs.)" rules={[{ required: true, type: 'number', min: 1 }]}>
            <InputNumber className="w-full rounded-lg h-10 flex items-center" placeholder="Enter amount" />
          </Form.Item>
          <Form.Item name="description" label="Remarks">
            <Input placeholder="Optional description" className="rounded-lg h-10" />
          </Form.Item>
          <Button type="primary" htmlType="submit" size="large" block icon={<ArrowUpOutlined />} loading={loading} className="rounded-xl mt-4 h-12">
            Make Deposit
          </Button>
        </Form>
      )
    },
    {
      key: 'withdraw',
      label: (
        <span className="flex items-center gap-2 px-4">
          <ArrowDownOutlined className="text-red-500" /> Withdraw
        </span>
      ),
      children: (
        <Form form={formWithdraw} onFinish={onWithdraw} layout="vertical" className="mt-4 max-w-lg">
          <Form.Item name="accountId" label="Source Account" rules={[{ required: true }]}>
            <Select placeholder="Select account to withdraw from" className="rounded-lg h-10">
              {accounts.map(acc => (
                <Option key={acc.id} value={acc.id}>
                  {acc.accountType} (****{acc.accountNumber.slice(-4)}) - Rs. {acc.balance.toLocaleString()}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="amount" label="Amount (Rs.)" rules={[{ required: true, type: 'number', min: 1 }]}>
            <InputNumber className="w-full rounded-lg h-10 flex items-center" placeholder="Enter amount" />
          </Form.Item>
          <Form.Item name="description" label="Remarks">
            <Input placeholder="Optional description" className="rounded-lg h-10" />
          </Form.Item>
          <Button type="primary" danger htmlType="submit" size="large" block icon={<ArrowDownOutlined />} loading={loading} className="rounded-xl mt-4 h-12">
            Confirm Withdrawal
          </Button>
        </Form>
      )
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Title level={2}>Manage Funds</Title>
        <Text type="secondary" className="text-lg">Move money between accounts or external recipients securely</Text>
      </div>

      <Card className="premium-card">
        <Tabs 
          defaultActiveKey="transfer" 
          items={tabItems} 
          className="custom-tabs"
          size="large"
        />
      </Card>

      <div className="mt-8">
        <Alert
          message="Security Tip"
          description="Never share your system ID or transaction passwords with anyone. SkyBank will never ask for your credentials via call or email."
          type="info"
          showIcon
          icon={<InfoCircleOutlined className="text-blue-500" />}
          className="rounded-xl bg-blue-50 border-blue-100"
        />
      </div>
    </div>
  );
};

export default TransferPage;
