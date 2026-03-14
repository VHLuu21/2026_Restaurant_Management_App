import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Typography, message } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginApi } from '../api/authApi';
import { saveAuth } from '../utils/auth';
import { connectAdminSocket } from '../realtime/socket';

interface LoginFormValues {
    email: string;
    password: string;
}

export default function LoginPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: LoginFormValues) => {
        try {
            setLoading(true);
            const result = await loginApi(values.email, values.password);
            saveAuth(result.accessToken, result.user);
            connectAdminSocket();
            message.success('Đăng nhập thành công');
            navigate('/dashboard');
        } catch (error: any) {
            message.error(error?.response?.data?.message || 'Đăng nhập thất bại');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#f5f5f5',
            }}
        >
            <Card style={{ width: 420 }}>
                <Typography.Title level={3} style={{ textAlign: 'center' }}>
                    Restaurant Admin Login
                </Typography.Title>

                <Form layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email' },
                            { type: 'email', message: 'Email không hợp lệ' },
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="admin@restaurant.com" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block loading={loading}>
                        Đăng nhập
                    </Button>
                </Form>
            </Card>
        </div>
    );
}