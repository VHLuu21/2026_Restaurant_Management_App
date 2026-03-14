import {
    Button,
    Form,
    Image,
    Input,
    InputNumber,
    Modal,
    Popconfirm,
    Select,
    Space,
    Switch,
    Table,
    Typography,
    message,
} from 'antd';
import { useEffect, useState } from 'react';
import {
    createDish,
    deleteDish,
    getDishes,
    toggleDishAvailability,
    updateDish,
} from '../api/dishesApi';
import { getMenuCategories } from '../api/menuCategoriesApi';
import type { Dish, MenuCategory } from '../types';

interface DishFormValues {
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    isAvailable?: boolean;
    categoryId: number;
}

export default function DishesPage() {
    const [data, setData] = useState<Dish[]>([]);
    const [categories, setCategories] = useState<MenuCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Dish | null>(null);
    const [filterCategoryId, setFilterCategoryId] = useState<number | undefined>();
    const [form] = Form.useForm<DishFormValues>();

    const loadCategories = async () => {
        try {
            const result = await getMenuCategories();
            setCategories(result);
        } catch (error) {
            console.error(error);
        }
    };

    const loadData = async () => {
        try {
            setLoading(true);
            const result = await getDishes(filterCategoryId);
            setData(result);
        } catch (error: any) {
            message.error(error?.response?.data?.message || 'Không tải được món ăn');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        loadData();
    }, [filterCategoryId]);

    const openCreateModal = () => {
        setEditingItem(null);
        form.resetFields();
        form.setFieldsValue({
            price: 0,
            isAvailable: true,
        });
        setOpen(true);
    };

    const openEditModal = (record: Dish) => {
        setEditingItem(record);
        form.setFieldsValue({
            name: record.name,
            description: record.description,
            price: Number(record.price),
            imageUrl: record.imageUrl,
            isAvailable: record.isAvailable,
            categoryId: record.categoryId,
        });
        setOpen(true);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            if (editingItem) {
                await updateDish(editingItem.id, values);
                message.success('Cập nhật món ăn thành công');
            } else {
                await createDish(values);
                message.success('Tạo món ăn thành công');
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
            await deleteDish(id);
            message.success('Xóa món ăn thành công');
            loadData();
        } catch (error: any) {
            message.error(error?.response?.data?.message || 'Xóa món ăn thất bại');
        }
    };

    const handleToggleAvailability = async (record: Dish, checked: boolean) => {
        try {
            await toggleDishAvailability(record.id, checked);
            message.success('Cập nhật trạng thái món ăn thành công');
            loadData();
        } catch (error: any) {
            message.error(error?.response?.data?.message || 'Cập nhật trạng thái thất bại');
        }
    };

    return (
        <div>
            <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
                <Typography.Title level={3} style={{ margin: 0 }}>
                    Quản lý món ăn
                </Typography.Title>

                <Space>
                    <Select
                        allowClear
                        placeholder="Lọc theo danh mục"
                        style={{ width: 220 }}
                        value={filterCategoryId}
                        onChange={(value) => setFilterCategoryId(value)}
                        options={categories.map((item) => ({
                            value: item.id,
                            label: item.name,
                        }))}
                    />

                    <Button type="primary" onClick={openCreateModal}>
                        Thêm món ăn
                    </Button>
                </Space>
            </Space>

            <Table
                rowKey="id"
                loading={loading}
                dataSource={data}
                scroll={{ x: 1200 }}
                columns={[
                    { title: 'ID', dataIndex: 'id', width: 80 },
                    {
                        title: 'Ảnh',
                        dataIndex: 'imageUrl',
                        width: 100,
                        render: (value: string) =>
                            value ? (
                                <Image src={value} alt="dish" width={60} height={60} style={{ objectFit: 'cover' }} />
                            ) : (
                                'Không có'
                            ),
                    },
                    { title: 'Tên món', dataIndex: 'name', width: 180 },
                    {
                        title: 'Danh mục',
                        render: (_, record) => record.category?.name || '-',
                        width: 160,
                    },
                    {
                        title: 'Giá',
                        dataIndex: 'price',
                        width: 140,
                        render: (value: number) => `${Number(value).toLocaleString('vi-VN')} đ`,
                    },
                    {
                        title: 'Đang bán',
                        dataIndex: 'isAvailable',
                        width: 120,
                        render: (value: boolean, record) => (
                            <Switch checked={value} onChange={(checked) => handleToggleAvailability(record, checked)} />
                        ),
                    },
                    {
                        title: 'Mô tả',
                        dataIndex: 'description',
                        ellipsis: true,
                    },
                    {
                        title: 'Hành động',
                        width: 160,
                        render: (_, record) => (
                            <Space>
                                <Button onClick={() => openEditModal(record)}>Sửa</Button>
                                <Popconfirm
                                    title="Bạn chắc chắn muốn xóa món này?"
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
                title={editingItem ? 'Cập nhật món ăn' : 'Thêm món ăn'}
                open={open}
                onOk={handleSubmit}
                onCancel={() => setOpen(false)}
                width={700}
                destroyOnClose
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Tên món ăn"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên món ăn' }]}
                    >
                        <Input placeholder="Ví dụ: Bò lúc lắc" />
                    </Form.Item>

                    <Form.Item
                        label="Danh mục"
                        name="categoryId"
                        rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
                    >
                        <Select
                            options={categories.map((item) => ({
                                value: item.id,
                                label: item.name,
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Giá bán"
                        name="price"
                        rules={[{ required: true, message: 'Vui lòng nhập giá bán' }]}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item label="Ảnh món ăn (URL)" name="imageUrl">
                        <Input placeholder="https://..." />
                    </Form.Item>

                    <Form.Item shouldUpdate>
                        {() => {
                            const url = form.getFieldValue('imageUrl');
                            return url ? (
                                <Image
                                    src={url}
                                    width={120}
                                    style={{ marginTop: 10, objectFit: 'cover' }}
                                />
                            ) : null;
                        }}
                    </Form.Item>

                    <Form.Item label="Mô tả" name="description">
                        <Input.TextArea rows={4} placeholder="Mô tả món ăn" />
                    </Form.Item>

                    <Form.Item label="Đang bán" name="isAvailable" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}