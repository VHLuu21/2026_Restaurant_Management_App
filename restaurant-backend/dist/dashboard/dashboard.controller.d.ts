import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getSummary(): Promise<{
        totalTables: number;
        availableTables: number;
        reservedTables: number;
        pendingReservations: number;
        confirmedReservations: number;
    }>;
}
