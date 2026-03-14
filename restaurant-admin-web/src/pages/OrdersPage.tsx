import {
    Button,
    Form,
    Input,
    Modal,
    Select,
    Space,
    Table,
    Typography,
    message,
    notification,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus } from '../api/ordersApi';
import { getSocket } from '../realtime/socket';
import type { Order, OrderStatus } from '../types';

interface StatusFormValues {
    status: OrderStatus;
    note?: string;
}

export default function OrdersPage() {
    const [data, setData] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>();
    const [open, setOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [form] = Form.useForm<StatusFormValues>();

    const loadData = async () => {
        try {
            setLoading(true);
            const result = await getOrders(statusFilter);
            setData(result);
        } catch (error: any) {
            message.error(error?.response?.data?.message || 'Không tải được danh sách order');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [statusFilter]);

    useEffect(() => {
        const socket = getSocket();

        const handleOrderCreated = (payload: any) => {
            loadData();

            notification.info({
                message: 'Có order mới',
                description: payload?.order
                    ? `Order #${payload.order.id} - Reservation #${payload.order.reservationId}`
                    : 'Hệ thống vừa nhận một order mới.',
                placement: 'topRight',
            });
        };

        const handleOrderUpdated = () => {
            loadData();
        };

        socket.on('order-created', handleOrderCreated);
        socket.on('order-updated', handleOrderUpdated);

        return () => {
            socket.off('order-created', handleOrderCreated);
            socket.off('order-updated', handleOrderUpdated);
        };
    }, []);

    const openStatusModal = (record: Order) => {
        setSelectedOrder(record);
        form.resetFields();
        form.setFieldsValue({
            status: record.status,
            note: record.note,
        });
        setOpen(true);
    };

    const handleUpdateStatus = async () => {
        if (!selectedOrder) return;

        try {
            const values = await form.validateFields();
            await updateOrderStatus(selectedOrder.id, values);
            message.success('Cập nhật trạng thái order thành công');
            setOpen(false);
            loadData();
        } catch (error: any) {
            if (error?.errorFields) return;
            message.error(error?.response?.data?.message || 'Cập nhật trạng thái thất bại');
        }
    };

    return (
        <div>
            <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
                <Typography.Title level={3} style={{ margin: 0 }}>
                    Quản lý order
                </Typography.Title>

                <Select
                    allowClear
                    placeholder="Lọc theo trạng thái"
                    style={{ width: 220 }}
                    value={statusFilter}
                    onChange={(value) => setStatusFilter(value)}
                    options={[
                        { value: 'PENDING', label: 'PENDING' },
                        { value: 'PREPARING', label: 'PREPARING' },
                        { value: 'SERVED', label: 'SERVED' },
                        { value: 'CANCELLED', label: 'CANCELLED' },
                    ]}
                />
            </Space>

            <Table
                rowKey="id"
                loading={loading}
                dataSource={data}
                expandable={{
                    expandedRowRender: (record) => (
                        <div>
                            {record.items.map((item) => (
                                <div key={item.id} style={{ marginBottom: 8 }}>
                                    {item.dishName} — {item.quantity} x {item.unitPrice} = {item.lineTotal}
                                </div>
                            ))}
                        </div>
                    ),
                }}
                columns={[
                    {
                        title: 'Mã order',
                        dataIndex: 'id',
                        width: 90,
                    },
                    {
                        title: 'Reservation',
                        dataIndex: 'reservationId',
                    },
                    {
                        title: 'Khách hàng',
                        render: (_, record) => record.reservation?.customerName || '-',
                    },
                    {
                        title: 'Bàn',
                        render: (_, record) =>
                            record.reservation?.table?.tableNumber || record.reservation?.tableId || '-',
                    },
                    {
                        title: 'Tổng tiền',
                        dataIndex: 'totalAmount',
                    },
                    {
                        title: 'Trạng thái',
                        dataIndex: 'status',
                    },
                    {
                        title: 'Tạo lúc',
                        dataIndex: 'createdAt',
                        render: (value: string) => dayjs(value).format('DD/MM/YYYY HH:mm'),
                    },
                    {
                        title: 'Hành động',
                        render: (_, record) => (
                            <Button type="primary" onClick={() => openStatusModal(record)}>
                                Xử lý
                            </Button>
                        ),
                    },
                ]}
            />

            <Modal
                title={`Xử lý order #${selectedOrder?.id || ''}`}
                open={open}
                onOk={handleUpdateStatus}
                onCancel={() => setOpen(false)}
                destroyOnClose
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Trạng thái"
                        name="status"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                    >
                        <Select
                            options={[
                                { value: 'PENDING', label: 'PENDING' },
                                { value: 'PREPARING', label: 'PREPARING' },
                                { value: 'SERVED', label: 'SERVED' },
                                { value: 'CANCELLED', label: 'CANCELLED' },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item label="Ghi chú" name="note">
                        <Input.TextArea rows={4} placeholder="Nhập ghi chú xử lý" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}