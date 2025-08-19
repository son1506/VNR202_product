// MainRoutes.jsx - Improved with route transitions
import { Navigate, Route, Routes, useLocation } from "react-router";
import { AnimatePresence } from "framer-motion";
import NotFound from "../../components/NotFound";
import AdminLayout from "../../layouts/AdminLayout/AdminLayout";
import MainLayout from "../../layouts/MainLayout/MainLayout";
import Dashboard from "../../pages/Admin/Dashboard/Dashboard";
import Login from "../../pages/Authentication/Login";
import Register from "../../pages/Authentication/Register";
import Home from "../../../pages/Home/Home";
import History from "../../../pages/History/History";

const MainRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/">
          <Route path="/" element={<MainLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/history" element={<History />} />
          </Route>
        </Route>
        
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        
        <Route path="" element={<AdminLayout />}>
          <Route path="" element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
        
        <Route path="history" element={<History />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

export default MainRoutes;