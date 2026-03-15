import {
  Button,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Space,
  Table,
  Typography,
  message,
} from 'antd';

import { useEffect, useState } from 'react';

import {
  createEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee,
} from '../api/employeesApi';

import type { Employee } from '../types';

interface EmployeeFormValues {
  fullName: string;
  phone?: string;
  position?: string;
  salary?: number;
  avatar?: string;
}

export default function EmployeesPage() {
  const [data, setData] = useState<Employee[]>([]);
  const [filteredData, setFilteredData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Employee | null>(null);
  const [search, setSearch] = useState('');

  const [form] = Form.useForm<EmployeeFormValues>();

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await getEmployees();
      setData(result);
      setFilteredData(result);
    } catch {
      message.error('Không tải được nhân viên');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const keyword = search.toLowerCase();

    const filtered = data.filter((e) =>
      e.fullName?.toLowerCase().includes(keyword)
    );

    setFilteredData(filtered);
  }, [search, data]);

  const openCreateModal = () => {
    setEditingItem(null);
    form.resetFields();
    form.setFieldsValue({
      salary: 0,
    });
    setOpen(true);
  };

  const openEditModal = (record: Employee) => {
    setEditingItem(record);

    form.setFieldsValue({
      fullName: record.fullName,
      phone: record.phone,
      position: record.position,
      salary: record.salary,
      avatar: record.avatarUrl,
    });

    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingItem) {
        await updateEmployee(editingItem.id, values);
        message.success('Cập nhật nhân viên thành công');
      } else {
        await createEmployee(values);
        message.success('Thêm nhân viên thành công');
      }

      setOpen(false);
      loadData();
    } catch (error: any) {
      console.error(error);
      message.error(error?.response?.data?.message || 'Thao tác thất bại');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteEmployee(id);
      message.success('Xóa nhân viên thành công');
      loadData();
    } catch {
      message.error('Xóa thất bại');
    }
  };

  const avatarPreview = Form.useWatch('avatar', form);

  return (
    <div>
      <Space
        style={{
          width: '100%',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <Typography.Title level={3} style={{ margin: 0 }}>
          Quản lý nhân viên
        </Typography.Title>

        <Space>
          <Input.Search
            placeholder="Tìm nhân viên..."
            allowClear
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 220 }}
          />

          <Button type="primary" onClick={openCreateModal}>
            Thêm nhân viên
          </Button>
        </Space>
      </Space>

      <Table
        rowKey="id"
        loading={loading}
        dataSource={filteredData}
        pagination={{ pageSize: 8 }}
        columns={[
          {
            title: 'ID',
            dataIndex: 'id',
            width: 70,
          },
          {
            title: 'Avatar',
            dataIndex: 'avatar',
            render: (value: string) =>
              value ? (
                <Image src={value} width={50} height={50} />
              ) : (
                '—'
              ),
          },
          {
            title: 'Tên',
            dataIndex: 'fullName',
          },
          {
            title: 'SĐT',
            dataIndex: 'phone',
          },
          {
            title: 'Chức vụ',
            dataIndex: 'position',
          },
          {
            title: 'Lương',
            dataIndex: 'salary',
            sorter: (a: Employee, b: Employee) =>
              (a.salary || 0) - (b.salary || 0),
            render: (v: number) =>
              v ? `${v.toLocaleString('vi-VN')} đ` : '-',
          },
          {
            title: 'Hành động',
            render: (_, record: Employee) => (
              <Space>
                <Button onClick={() => openEditModal(record)}>
                  Sửa
                </Button>

                <Popconfirm
                  title="Bạn chắc chắn muốn xóa?"
                  onConfirm={() => handleDelete(record.id)}
                >
                  <Button danger>Xóa</Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title={editingItem ? 'Cập nhật nhân viên' : 'Thêm nhân viên'}
        open={open}
        onOk={handleSubmit}
        onCancel={() => setOpen(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên nhân viên"
            name="fullName"
            rules={[{ required: true, message: 'Nhập tên nhân viên' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="SĐT" name="phone">
            <Input />
          </Form.Item>

          <Form.Item label="Chức vụ" name="position">
            <Input />
          </Form.Item>

          <Form.Item label="Lương" name="salary">
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>

          <Form.Item label="Avatar URL" name="avatar">
            <Input placeholder="https://..." />
          </Form.Item>

          {avatarPreview && (
            <div style={{ textAlign: 'center', marginTop: 10 }}>
              <Image src={avatarPreview} width={100} />
            </div>
          )}
        </Form>
      </Modal>
    </div>
  );
}