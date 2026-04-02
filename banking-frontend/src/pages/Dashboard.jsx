import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Statistic, Table, Tag, Button, Empty, Skeleton, message } from 'antd';
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  SwapOutlined, 
  WalletOutlined,
  HistoryOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

const Dashboard = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      // Fetch accounts
      const accountsRes = await api.get(`/accounts/user/${user.userId}`);
      setAccounts(accountsRes.data);

      // Fetch transactions for the first account if it exists
      if (accountsRes.data.length > 0) {
        const firstAccountId = accountsRes.data[0].id;
        const transRes = await api.get(`/transactions/history/${firstAccountId}`);
        setTransactions(transRes.data.slice(0, 5)); // Only show top 5
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      message.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);

  const columns = [
    {
      title: 'Action',
      dataIndex: 'transactionType',
      key: 'transactionType',
      render: (type) => (
        <Tag color={type === 'DEPOSIT' ? 'green' : type === 'WITHDRAW' ? 'red' : 'blue'}>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount, record) => (
        <Text strong className={record.transactionType === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'}>
          {record.transactionType === 'DEPOSIT' ? '+' : '-'} Rs. {amount.toLocaleString()}
        </Text>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'transactionDate',
      key: 'transactionDate',
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <Title level={2} className="!mb-0">Financial Overview</Title>
          <Text type="secondary text-lg">Manage your accounts and track your performance</Text>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large"
          className="rounded-xl h-11 h-12"
          onClick={() => message.info('Account creation coming soon!')}
        >
          Open New Account
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12}>
              <Card className="premium-card bg-blue-600 border-none">
                <Statistic
                  title={<span className="text-blue-100 text-sm font-medium">Net Worth</span>}
                  value={totalBalance}
                  precision={2}
                  prefix={<span className="text-white">Rs. </span>}
                  valueStyle={{ color: '#fff', fontSize: '28px', fontWeight: 700 }}
                />
                <div className="mt-4 flex items-center gap-2 text-blue-100 text-xs">
                  <WalletOutlined />
                  <span>Across all your active accounts</span>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Card className="premium-card">
                <Statistic
                  title={<span className="text-gray-400 text-sm">Monthly Growth</span>}
                  value={11.28}
                  precision={2}
                  valueStyle={{ color: '#3f8600', fontSize: '28px', fontWeight: 700 }}
                  prefix={<ArrowUpOutlined />}
                  suffix="%"
                />
                <div className="mt-4 flex items-center gap-2 text-gray-400 text-xs">
                   <span>Projected based on current trends</span>
                </div>
              </Card>
            </Col>

            <Col xs={24}>
              <Card 
                title={
                  <div className="flex items-center gap-2">
                    <HistoryOutlined className="text-blue-500" />
                    <span>Recent Activity</span>
                  </div>
                }
                extra={<Button type="link" className="p-0">View All</Button>}
                className="premium-card overflow-hidden"
              >
                {loading ? (
                  <Skeleton active />
                ) : transactions.length > 0 ? (
                  <Table 
                    columns={columns} 
                    dataSource={transactions} 
                    pagination={false} 
                    rowKey="id"
                    className="mt-[-10px]"
                  />
                ) : (
                  <Empty description="No recent transactions found" className="py-8" />
                )}
              </Card>
            </Col>
          </Row>
        </Col>

        <Col xs={24} lg={8}>
          <Card 
            title="My Accounts" 
            className="premium-card h-full"
            bodyStyle={{ padding: 0 }}
          >
             <div className="px-6 py-4">
              {loading ? (
                <Skeleton active />
              ) : accounts.length > 0 ? (
                <div className="space-y-4">
                  {accounts.map((acc, index) => (
                    <motion.div
                      key={acc.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex justify-between items-center group cursor-pointer hover:bg-blue-50 hover:border-blue-100 transition-all"
                    >
                      <div>
                        <Text strong className="block text-gray-800">{acc.accountType}</Text>
                        <Text type="secondary" className="text-xs">**** {acc.accountNumber.slice(-4)}</Text>
                      </div>
                      <div className="text-right">
                        <Text strong className="block text-blue-600">Rs. {acc.balance.toLocaleString()}</Text>
                        <Tag color="success" className="mr-0 scale-75 origin-right">Active</Tag>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Empty description="No accounts found" />
              )}
             </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
