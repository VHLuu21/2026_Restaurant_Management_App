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
import { getReservations, updateReservationStatus } from '../api/reservationsApi';
import { getTables } from '../api/tablesApi';
import ReservationStatusTag from '../components/ReservationStatusTag';
import { getSocket } from '../realtime/socket';
import type { Reservation, ReservationStatus, RestaurantTable } from '../types';

interface StatusFormValues {
    status: ReservationStatus;
    tableId?: number;
    adminNote?: string;
}

export default function ReservationsPage() {
    const [data, setData] = useState<Reservation[]>([]);
    const [tables, setTables] = useState<RestaurantTable[]>([]);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState<ReservationStatus | undefined>();
    const [open, setOpen] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
    const [form] = Form.useForm<StatusFormValues>();

    const loadData = async () => {
        try {
            setLoading(true);
            const result = await getReservations(statusFilter);
            setData(result);
        } catch (error: any) {
            message.error(error?.response?.data?.message || 'Không tải được danh sách đặt bàn');
        } finally {
            setLoading(false);
        }
    };

    const loadTables = async () => {
        try {
            const result = await getTables();
            setTables(result);
        } catch (error: any) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadData();
    }, [statusFilter]);

    useEffect(() => {
        loadTables();

        const socket = getSocket();

        const handleReservationCreated = (payload: any) => {
            loadData();

            notification.info({
                message: 'Có đơn đặt bàn mới',
                description: payload?.reservation
                    ? `${payload.reservation.customerName} - ${payload.reservation.guestCount} khách`
                    : 'Hệ thống vừa nhận một yêu cầu đặt bàn mới.',
                placement: 'topRight',
            });
        };

        const handleReservationUpdated = () => {
            loadData();
            loadTables();
        };

        const handleTableUpdated = () => {
            loadTables();
        };

        socket.on('reservation-created', handleReservationCreated);
        socket.on('reservation-updated', handleReservationUpdated);
        socket.on('table-updated', handleTableUpdated);

        return () => {
            socket.off('reservation-created', handleReservationCreated);
            socket.off('reservation-updated', handleReservationUpdated);
            socket.off('table-updated', handleTableUpdated);
        };
    }, []);

    const openStatusModal = (record: Reservation) => {
        setSelectedReservation(record);
        form.resetFields();
        form.setFieldsValue({
            status: record.status,
            tableId: record.tableId,
            adminNote: record.adminNote,
        });
        setOpen(true);
    };

    const handleUpdateStatus = async () => {
        if (!selectedReservation) return;

        try {
            const values = await form.validateFields();
            await updateReservationStatus(selectedReservation.id, values);
            message.success('Cập nhật trạng thái thành công');
            setOpen(false);
            loadData();
            loadTables();
        } catch (error: any) {
            if (error?.errorFields) return;
            message.error(error?.response?.data?.message || 'Cập nhật trạng thái thất bại');
        }
    };

    return (
        <div>
            <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
                <Typography.Title level={3} style={{ margin: 0 }}>
                    Quản lý đặt bàn
                </Typography.Title>

                <Select
                    allowClear
                    placeholder="Lọc theo trạng thái"
                    style={{ width: 220 }}
                    value={statusFilter}
                    onChange={(value) => setStatusFilter(value)}
                    options={[
                        { value: 'PENDING', label: 'PENDING' },
                        { value: 'CONFIRMED', label: 'CONFIRMED' },
                        { value: 'REJECTED', label: 'REJECTED' },
                        { value: 'COMPLETED', label: 'COMPLETED' },
                        { value: 'CANCELLED', label: 'CANCELLED' },
                    ]}
                />
            </Space>

            <Table
                rowKey="id"
                loading={loading}
                dataSource={data}
                columns={[
                    {
                        title: 'Mã đơn',
                        dataIndex: 'id',
                        width: 90,
                    },
                    {
                        title: 'Email',
                        dataIndex: 'email',
                        render: (value: string) => value || '-',
                    },
                    {
                        title: 'Tạo lúc',
                        dataIndex: 'createdAt',
                        render: (value: string) => value ? dayjs(value).format('DD/MM/YYYY HH:mm') : '-',
                    },
                    {
                        title: 'Khách hàng',
                        dataIndex: 'customerName',
                    },
                    {
                        title: 'SĐT',
                        dataIndex: 'phone',
                    },
                    {
                        title: 'Thời gian',
                        dataIndex: 'reservationTime',
                        render: (value: string) => dayjs(value).format('DD/MM/YYYY HH:mm'),
                    },
                    {
                        title: 'Số khách',
                        dataIndex: 'guestCount',
                    },
                    {
                        title: 'Bàn',
                        render: (_, record) => record.table?.tableNumber || record.tableId || '-',
                    },
                    {
                        title: 'Trạng thái',
                        dataIndex: 'status',
                        render: (value: ReservationStatus) => <ReservationStatusTag status={value} />,
                    },
                    {
                        title: 'Ghi chú',
                        dataIndex: 'note',
                        ellipsis: true,
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
                title={`Xử lý đơn đặt bàn #${selectedReservation?.id || ''}`}
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
                                { value: 'CONFIRMED', label: 'CONFIRMED' },
                                { value: 'REJECTED', label: 'REJECTED' },
                                { value: 'COMPLETED', label: 'COMPLETED' },
                                { value: 'CANCELLED', label: 'CANCELLED' },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item label="Chỉ định bàn" name="tableId">
                        <Select
                            allowClear
                            placeholder="Chọn bàn nếu muốn"
                            options={tables.map((table) => ({
                                value: table.id,
                                label: `${table.tableNumber} - ${table.capacity} chỗ - ${table.status}`,
                            }))}
                        />
                    </Form.Item>

                    <Form.Item label="Ghi chú admin" name="adminNote">
                        <Input.TextArea rows={4} placeholder="Nhập ghi chú xử lý" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}