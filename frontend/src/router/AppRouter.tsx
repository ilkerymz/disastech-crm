import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import MeetingListPage from "../pages/meetings/MeetingListPage";
import AccountListPage from "../pages/accounts/AccountListPage";
import CalendarPage from "../pages/calendar/CalendarPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import LoginPage from "../pages/auth/LoginPage";
import AdminUserPage from "../pages/admin/AdminUserPage";
import RequireAuth from "./RequireAuth";
import RequireSuperAdmin from "./RequireSuperAdmin";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<RequireAuth />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/meetings" element={<MeetingListPage />} />
            <Route path="/accounts" element={<AccountListPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route element={<RequireSuperAdmin />}>
              <Route path="/admin/users" element={<AdminUserPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
