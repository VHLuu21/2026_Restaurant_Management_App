import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import DishesPage from './pages/DishesPage';
import LoginPage from './pages/LoginPage';
import MenuCategoriesPage from './pages/MenuCategoriesPage';
import ReservationsPage from './pages/ReservationsPage';
import TableLayoutPage from './pages/TableLayoutPage';
import TablesPage from './pages/TablesPage';
import OrdersPage from './pages/OrdersPage';
import EmployeesPage from './pages/employeesPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/reservations" element={<ReservationsPage />} />
        <Route path="/tables" element={<TablesPage />} />
        <Route path="/tables/layout" element={<TableLayoutPage />} />
        <Route path="/menu/categories" element={<MenuCategoriesPage />} />
        <Route path="/menu/dishes" element={<DishesPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route  path="/employees" element={<EmployeesPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}