import { Card, Col, Row, Statistic, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import { getDashboardSummary } from '../api/dashboardApi';
import { getSocket } from '../realtime/socket';
import type { DashboardSummary } from '../types';

export default function DashboardPage() {
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [loading, setLoading] = useState(false);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await getDashboardSummary();
            setSummary(data);
        } catch (error: any) {
            message.error(error?.response?.data?.message || 'Không tải được dashboard');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();

        const socket = getSocket();

        const handleDashboardUpdated = () => {
            loadData();
        };

        socket.on('dashboard-updated', handleDashboardUpdated);

        return () => {
            socket.off('dashboard-updated', handleDashboardUpdated);
        };
    }, []);

    return (
        <div>
            <Typography.Title level={3}>Dashboard</Typography.Title>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={12} lg={8}>
                    <Card loading={loading}>
                        <Statistic title="Tổng số bàn" value={summary?.totalTables || 0} />
                    </Card>
                </Col>

                <Col xs={24} md={12} lg={8}>
                    <Card loading={loading}>
                        <Statistic title="Bàn trống" value={summary?.availableTables || 0} />
                    </Card>
                </Col>

                <Col xs={24} md={12} lg={8}>
                    <Card loading={loading}>
                        <Statistic title="Bàn đã giữ" value={summary?.reservedTables || 0} />
                    </Card>
                </Col>

                <Col xs={24} md={12} lg={8}>
                    <Card loading={loading}>
                        <Statistic title="Đơn chờ duyệt" value={summary?.pendingReservations || 0} />
                    </Card>
                </Col>

                <Col xs={24} md={12} lg={8}>
                    <Card loading={loading}>
                        <Statistic title="Đơn đã xác nhận" value={summary?.confirmedReservations || 0} />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}