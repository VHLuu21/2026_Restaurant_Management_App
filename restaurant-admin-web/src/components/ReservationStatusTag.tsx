import { Tag } from 'antd';
import type { ReservationStatus } from '../types';

interface Props {
    status: ReservationStatus;
}

export default function ReservationStatusTag({ status }: Props) {
    if (status === 'PENDING') return <Tag color="gold">PENDING</Tag>;
    if (status === 'CONFIRMED') return <Tag color="green">CONFIRMED</Tag>;
    if (status === 'REJECTED') return <Tag color="red">REJECTED</Tag>;
    if (status === 'COMPLETED') return <Tag color="blue">COMPLETED</Tag>;
    return <Tag color="default">CANCELLED</Tag>;
}