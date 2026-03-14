import {
    Button,
    Form,
    Input,
    InputNumber,
    Modal,
    Popconfirm,
    Select,
    Space,
    Table,
    Typography,
    message,
} from 'antd';
import { useEffect, useState } from 'react';
import { createTable, deleteTable, getTables, updateTable } from '../api/tablesApi';
import TableStatusTag from '../components/TableStatusTag';
import type { RestaurantTable, TableStatus } from '../types';
import { getSocket } from '../realtime/socket';

interface TableFormValues {
    tableNumber: string;
    capacity: number;
    area?: string;
    status?: TableStatus;
    positionX?: number;
    positionY?: number;
}

export default function TablesPage() {
    const [data, setData] = useState<RestaurantTable[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [editingTable, setEditingTable] = useState<RestaurantTable | null>(null);
    const [form] = Form.useForm<TableFormValues>();

    const loadData = async () => {
        try {
            setLoading(true);
            const result = await getTables();
            setData(result);
        } catch (error: any) {
            message.error(error?.response?.data?.message || 'Không tải được danh sách bàn');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();

        const socket = getSocket();

        const handleTableUpdated = () => {
            loadData();
        };

        socket.on('table-updated', handleTableUpdated);

        return () => {
            socket.off('table-updated', handleTableUpdated);
        };
    }, []);
    const openCreateModal = () => {
        setEditingTable(null);
        form.resetFields();
        form.setFieldsValue({
            capacity: 4,
            status: 'AVAILABLE',
            positionX: 0,
            positionY: 0,
        });
        setOpen(true);
    };

    const openEditModal = (record: RestaurantTable) => {
        setEditingTable(record);
        form.setFieldsValue({
            tableNumber: record.tableNumber,
            capacity: record.capacity,
            area: record.area,
            status: record.status,
            positionX: record.positionX,
            positionY: record.positionY,
        });
        setOpen(true);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            if (editingTable) {
                await updateTable(editingTable.id, values);
                message.success('Cập nhật bàn thành công');
            } else {
                await createTable(values);
                message.success('Tạo bàn thành công');
            }

            setOpen(false);
            loadData();
        } catch (error: any) {
            if (error?.errorFields) return;
            message.error(error?.response?.data?.message || 'Thao tác thất bại');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteTable(id);
            message.success('Xóa bàn thành công');
            loadData();
        } catch (error: any) {
            message.error(error?.response?.data?.message || 'Xóa bàn thất bại');
        }
    };

    return (
        <div>
            <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
                <Typography.Title level={3} style={{ margin: 0 }}>
                    Quản lý bàn
                </Typography.Title>
                <Button type="primary" onClick={openCreateModal}>
                    Thêm bàn
                </Button>
            </Space>

            <Table
                rowKey="id"
                loading={loading}
                dataSource={data}
                columns={[
                    {
                        title: 'ID',
                        dataIndex: 'id',
                        width: 80,
                    },
                    {
                        title: 'Số bàn',
                        dataIndex: 'tableNumber',
                    },
                    {
                        title: 'Sức chứa',
                        dataIndex: 'capacity',
                    },
                    {
                        title: 'Khu vực',
                        dataIndex: 'area',
                    },
                    {
                        title: 'Trạng thái',
                        dataIndex: 'status',
                        render: (value: TableStatus) => <TableStatusTag status={value} />,
                    },
                    {
                        title: 'Tọa độ',
                        render: (_, record) => `${record.positionX}, ${record.positionY}`,
                    },
                    {
                        title: 'Hành động',
                        render: (_, record) => (
                            <Space>
                                <Button onClick={() => openEditModal(record)}>Sửa</Button>
                                <Popconfirm
                                    title="Bạn chắc chắn muốn xóa bàn này?"
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
                title={editingTable ? 'Cập nhật bàn' : 'Thêm bàn'}
                open={open}
                onOk={handleSubmit}
                onCancel={() => setOpen(false)}
                destroyOnClose
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Số bàn"
                        name="tableNumber"
                        rules={[{ required: true, message: 'Vui lòng nhập số bàn' }]}
                    >
                        <Input placeholder="Ví dụ A01" />
                    </Form.Item>

                    <Form.Item
                        label="Sức chứa"
                        name="capacity"
                        rules={[{ required: true, message: 'Vui lòng nhập sức chứa' }]}
                    >
                        <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item label="Khu vực" name="area">
                        <Input placeholder="Tầng 1 / VIP / Sân vườn" />
                    </Form.Item>

                    <Form.Item label="Trạng thái" name="status">
                        <Select
                            options={[
                                { value: 'AVAILABLE', label: 'AVAILABLE' },
                                { value: 'RESERVED', label: 'RESERVED' },
                                { value: 'OCCUPIED', label: 'OCCUPIED' },
                                { value: 'UNAVAILABLE', label: 'UNAVAILABLE' },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item label="Vị trí X" name="positionX">
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item label="Vị trí Y" name="positionY">
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}