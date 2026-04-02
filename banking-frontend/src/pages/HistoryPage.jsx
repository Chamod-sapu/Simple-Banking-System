import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Typography, message, Select, Row, Col, Space, Empty, Spin } from 'antd';
import { 
  HistoryOutlined, 
  SearchOutlined, 
  FilterOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;
const { Option } = Select;

const HistoryPage = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, [user]);

  const fetchAccounts = async () => {
    try {
      const response = await api.get(`/accounts/user/${user.userId}`);
      setAccounts(response.data);
      if (response.data.length > 0) {
        setSelectedAccountId(response.data[0].id);
        fetchHistory(response.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const fetchHistory = async (accountId) => {
    setLoading(true);
    try {
      const response = await api.get(`/transactions/history/${accountId}`);
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
      message.error('Failed to load transaction history');
    } finally {
      setLoading(false);
    }
  };

  const handleAccountChange = (value) => {
    setSelectedAccountId(value);
    fetchHistory(value);
  };

  const columns = [
    {
      title: 'Transaction Date',
      dataIndex: 'transactionDate',
      key: 'transactionDate',
      render: (date) => (
        <Space className="text-gray-600">
          <CalendarOutlined className="text-blue-400" />
          <span>{new Date(date).toLocaleString()}</span>
        </Space>
      ),
      sortOrder: 'descend',
      sorter: (a, b) => new Date(a.transactionDate) - new Date(b.transactionDate),
    },
    {
      title: 'Type',
      dataIndex: 'transactionType',
      key: 'transactionType',
      render: (type) => {
        let color = 'blue';
        if (type === 'DEPOSIT') color = 'green';
        if (type === 'WITHDRAW') color = 'red';
        return <Tag color={color} className="rounded-full px-3 font-medium">{type}</Tag>;
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (desc) => <Text className="text-gray-700">{desc}</Text>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      render: (amount, record) => (
        <Text strong className={record.transactionType === 'DEPOSIT' ? 'text-green-600 text-base' : 'text-red-600 text-base'}>
          {record.transactionType === 'DEPOSIT' ? '+' : '-'} Rs. {amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'SUCCESS' ? 'success' : 'error'} className="rounded-full">
          {status}
        </Tag>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <Title level={2} className="!mb-0">Transaction History</Title>
          <Text type="secondary" className="text-lg">Detailed statement of all your financial movements</Text>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Text strong>Filter by Account:</Text>
          <Select 
            value={selectedAccountId} 
            onChange={handleAccountChange} 
            className="w-full sm:w-64 h-10 rounded-lg"
            placeholder="Select Account"
          >
            {accounts.map(acc => (
              <Option key={acc.id} value={acc.id}>
                {acc.accountType} (****{acc.accountNumber.slice(-4)})
              </Option>
            ))}
          </Select>
        </div>
      </div>

      <Card className="premium-card overflow-hidden" bodyStyle={{ padding: 0 }}>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spin size="large" />
          </div>
        ) : history.length > 0 ? (
          <Table 
            columns={columns} 
            dataSource={history} 
            rowKey="id" 
            className="custom-table"
            pagination={{ pageSize: 10, position: ['bottomCenter'] }}
          />
        ) : (
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
            description="No transactions found for this account" 
            className="py-20"
          />
        )}
      </Card>
    </div>
  );
};

export default HistoryPage;
