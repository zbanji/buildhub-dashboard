import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ClientLogin } from "./pages/auth/ClientLogin";
import { AdminLogin } from "./pages/auth/AdminLogin";
import { ResetPassword } from "./pages/auth/ResetPassword";
import { ClientDashboard } from "./pages/client/ClientDashboard";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminProjects } from "./pages/admin/AdminProjects";
import { AdminProjectDetails } from "./pages/admin/AdminProjectDetails";
import { AdminProjectCreate } from "./pages/admin/AdminProjectCreate";
import { AdminProjectEdit } from "./pages/admin/AdminProjectEdit";
import { ClientProjectDetails } from "./pages/client/ClientProjectDetails";
import { ClientProjectEdit } from "./pages/client/ClientProjectEdit";
import { AdminLayout } from "./components/layouts/AdminLayout";
import { ClientLayout } from "./components/layouts/ClientLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/client/login" element={<ClientLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        <Route path="/admin" element={<ProtectedRoute expectedRole="admin" />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="projects/create" element={<AdminProjectCreate />} />
            <Route path="projects/:id" element={<AdminProjectDetails />} />
            <Route path="projects/:id/edit" element={<AdminProjectEdit />} />
          </Route>
        </Route>

        <Route path="/" element={<ProtectedRoute expectedRole="client" />}>
          <Route element={<ClientLayout />}>
            <Route index element={<ClientDashboard />} />
            <Route path="projects/:id" element={<ClientProjectDetails />} />
            <Route path="projects/:id/edit" element={<ClientProjectEdit />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}