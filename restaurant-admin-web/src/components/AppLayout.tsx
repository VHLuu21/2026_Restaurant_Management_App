import {
    AppstoreOutlined,
    DashboardOutlined,
    LogoutOutlined,
    MenuOutlined,
    ShoppingCartOutlined,
    TableOutlined,
    TagsOutlined,
    UnorderedListOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, Space, Typography } from 'antd';
import { useEffect, useMemo } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { connectAdminSocket, disconnectSocket } from '../realtime/socket';
import { clearAuth, getUser } from '../utils/auth';

const { Header, Sider, Content } = Layout;

export default function AppLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const user = getUser();

    useEffect(() => {
        connectAdminSocket();
    }, []);

    const selectedKey = useMemo(() => {
        if (location.pathname.startsWith('/dashboard')) return '/dashboard';
        if (location.pathname.startsWith('/reservations')) return '/reservations';
        if (location.pathname.startsWith('/tables/layout')) return '/tables/layout';
        if (location.pathname.startsWith('/tables')) return '/tables';
        if (location.pathname.startsWith('/menu/categories')) return '/menu/categories';
        if (location.pathname.startsWith('/menu/dishes')) return '/menu/dishes';
        if (location.pathname.startsWith('/orders')) return '/orders';
        if (location.pathname.startsWith('/employees')) return '/employees';
        return '/dashboard';
    }, [location.pathname]);

    const handleLogout = () => {
        disconnectSocket();
        clearAuth();
        navigate('/login');
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider>
                <div
                    style={{
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 18,
                        padding: 16,
                        textAlign: 'center',
                    }}
                >
                    Restaurant Admin
                </div>

                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    items={[
                        {
                            key: '/dashboard',
                            icon: <DashboardOutlined />,
                            label: <Link to="/dashboard">Dashboard</Link>,
                        },
                        {
                            key: '/orders',
                            icon: <ShoppingCartOutlined />,
                            label: <Link to="/orders">Orders</Link>,
                        },
                        {
                            key: '/reservations',
                            icon: <UnorderedListOutlined />,
                            label: <Link to="/reservations">Reservations</Link>,
                        },
                        {
                            key: '/tables',
                            icon: <TableOutlined />,
                            label: <Link to="/tables">Tables</Link>,
                        },
                        {
                            key: '/tables/layout',
                            icon: <AppstoreOutlined />,
                            label: <Link to="/tables/layout">Table Layout</Link>,
                        },
                        {
                            key: '/menu/categories',
                            icon: <TagsOutlined />,
                            label: <Link to="/menu/categories">Menu Categories</Link>,
                        },
                        {
                            key: '/menu/dishes',
                            icon: <MenuOutlined />,
                            label: <Link to="/menu/dishes">Dishes</Link>,
                        },
                        {
                            key: '/employees',
                            icon: <UserOutlined />,
                            label: <Link to="/employees">Employees</Link>,
                        },
                    ]}
                />
            </Sider>

            <Layout>
                <Header
                    style={{
                        background: '#fff',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingInline: 20,
                    }}
                >
                    <Typography.Title level={4} style={{ margin: 0 }}>
                        Admin Panel
                    </Typography.Title>

                    <Space>
                        <Typography.Text>
                            {user?.fullName} ({user?.role})
                        </Typography.Text>
                        <Button icon={<LogoutOutlined />} onClick={handleLogout}>
                            Logout
                        </Button>
                    </Space>
                </Header>

                <Content style={{ padding: 20 }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}