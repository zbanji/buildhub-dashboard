import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClientLogin from "./pages/auth/ClientLogin";
import AdminLogin from "./pages/auth/AdminLogin";
import { ResetPassword } from "./pages/auth/ResetPassword";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/client/login" element={<ClientLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        <Route path="/admin" element={<ProtectedRoute allowedRole="admin">
          <Layout>
            <Routes>
              <Route index element={<div>Admin Dashboard</div>} />
              <Route path="projects" element={<div>Admin Projects</div>} />
              <Route path="projects/create" element={<div>Create Project</div>} />
              <Route path="projects/:id" element={<div>Project Details</div>} />
              <Route path="projects/:id/edit" element={<div>Edit Project</div>} />
            </Routes>
          </Layout>
        </ProtectedRoute>} />

        <Route path="/" element={<ProtectedRoute allowedRole="client">
          <Layout>
            <Routes>
              <Route index element={<div>Client Dashboard</div>} />
              <Route path="projects/:id" element={<div>Project Details</div>} />
              <Route path="projects/:id/edit" element={<div>Edit Project</div>} />
            </Routes>
          </Layout>
        </ProtectedRoute>} />
      </Routes>
    </Router>
  );
}