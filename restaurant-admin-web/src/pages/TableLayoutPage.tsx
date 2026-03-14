import { Card, Col, Row, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import { getTables } from '../api/tablesApi';
import { getSocket } from '../realtime/socket';
import type { RestaurantTable } from '../types';

function getBackground(status: RestaurantTable['status']) {
    if (status === 'AVAILABLE') return '#d9f7be';
    if (status === 'RESERVED') return '#ffe58f';
    if (status === 'OCCUPIED') return '#ffccc7';
    return '#f0f0f0';
}

export default function TableLayoutPage() {
    const [tables, setTables] = useState<RestaurantTable[]>([]);

    const loadData = async () => {
        try {
            const result = await getTables();
            setTables(result);
        } catch (error: any) {
            message.error(error?.response?.data?.message || 'Không tải được layout bàn');
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

    return (
        <div>
            <Typography.Title level={3}>Table Layout</Typography.Title>

            <Row gutter={[16, 16]}>
                {tables.map((table) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={table.id}>
                        <Card
                            style={{
                                background: getBackground(table.status),
                                borderRadius: 12,
                            }}
                        >
                            <Typography.Title level={4} style={{ marginTop: 0 }}>
                                {table.tableNumber}
                            </Typography.Title>
                            <Typography.Paragraph style={{ marginBottom: 8 }}>
                                Sức chứa: {table.capacity}
                            </Typography.Paragraph>
                            <Typography.Paragraph style={{ marginBottom: 8 }}>
                                Khu vực: {table.area || 'Chưa có'}
                            </Typography.Paragraph>
                            <Typography.Text>Trạng thái: {table.status}</Typography.Text>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
}