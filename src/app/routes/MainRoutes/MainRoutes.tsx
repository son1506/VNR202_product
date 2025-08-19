import { Navigate, Route, Routes } from "react-router";
import NotFound from "../../components/NotFound";
import AdminLayout from "../../layouts/AdminLayout/AdminLayout";
import MainLayout from "../../layouts/MainLayout/MainLayout";
import Dashboard from "../../pages/Admin/Dashboard/Dashboard";
import Login from "../../pages/Authentication/Login";
import Register from "../../pages/Authentication/Register";
import Home from "../../pages/Customer/Home/Home";

const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/">
        <Route path="/" element={<MainLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Route>

      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />

      <Route path="" element={<AdminLayout />}>
        <Route path="" element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default MainRoutes;
