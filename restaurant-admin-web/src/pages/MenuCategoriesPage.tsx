import {
    Button,
    Form,
    Input,
    Modal,
    Popconfirm,
    Space,
    Switch,
    Table,
    Typography,
    message,
} from 'antd';
import { useEffect, useState } from 'react';
import {
    createMenuCategory,
    deleteMenuCategory,
    getMenuCategories,
    updateMenuCategory,
} from '../api/menuCategoriesApi';
import type { MenuCategory } from '../types';

interface FormValues {
    name: string;
    description?: string;
    isActive?: boolean;
}

export default function MenuCategoriesPage() {
    const [data, setData] = useState<MenuCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuCategory | null>(null);
    const [form] = Form.useForm<FormValues>();

    const loadData = async () => {
        try {
            setLoading(true);
            const result = await getMenuCategories();
            setData(result);
        } catch (error: any) {
            message.error(error?.response?.data?.message || 'Không tải được danh mục');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const openCreateModal = () => {
        setEditingItem(null);
        form.resetFields();
        form.setFieldsValue({ isActive: true });
        setOpen(true);
    };

    const openEditModal = (record: MenuCategory) => {
        setEditingItem(record);
        form.setFieldsValue({
            name: record.name,
            description: record.description,
            isActive: record.isActive,
        });
        setOpen(true);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            if (editingItem) {
                await updateMenuCategory(editingItem.id, values);
                message.success('Cập nhật danh mục thành công');
            } else {
                await createMenuCategory(values);
                message.success('Tạo danh mục thành công');
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
            await deleteMenuCategory(id);
            message.success('Xóa danh mục thành công');
            loadData();
        } catch (error: any) {
            message.error(error?.response?.data?.message || 'Xóa danh mục thất bại');
        }
    };

    return (
        <div>
            <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
                <Typography.Title level={3} style={{ margin: 0 }}>
                    Quản lý danh mục món ăn
                </Typography.Title>
                <Button type="primary" onClick={openCreateModal}>
                    Thêm danh mục
                </Button>
            </Space>

            <Table
                rowKey="id"
                loading={loading}
                dataSource={data}
                columns={[
                    { title: 'ID', dataIndex: 'id', width: 80 },
                    { title: 'Tên danh mục', dataIndex: 'name' },
                    { title: 'Mô tả', dataIndex: 'description' },
                    {
                        title: 'Hoạt động',
                        dataIndex: 'isActive',
                        render: (value: boolean) => (value ? 'Có' : 'Không'),
                    },
                    {
                        title: 'Hành động',
                        render: (_, record) => (
                            <Space>
                                <Button onClick={() => openEditModal(record)}>Sửa</Button>
                                <Popconfirm
                                    title="Bạn chắc chắn muốn xóa danh mục này?"
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
                title={editingItem ? 'Cập nhật danh mục' : 'Thêm danh mục'}
                open={open}
                onOk={handleSubmit}
                onCancel={() => setOpen(false)}
                destroyOnClose
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Tên danh mục"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
                    >
                        <Input placeholder="Ví dụ: Món chính" />
                    </Form.Item>

                    <Form.Item label="Mô tả" name="description">
                        <Input.TextArea rows={4} placeholder="Mô tả danh mục" />
                    </Form.Item>

                    <Form.Item label="Trạng thái hoạt động" name="isActive" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}