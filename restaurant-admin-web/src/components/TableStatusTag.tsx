import { Tag } from 'antd';
import type { TableStatus } from '../types';

interface Props {
    status: TableStatus;
}

export default function TableStatusTag({ status }: Props) {
    if (status === 'AVAILABLE') return <Tag color="green">AVAILABLE</Tag>;
    if (status === 'RESERVED') return <Tag color="orange">RESERVED</Tag>;
    if (status === 'OCCUPIED') return <Tag color="red">OCCUPIED</Tag>;
    return <Tag color="default">UNAVAILABLE</Tag>;
}