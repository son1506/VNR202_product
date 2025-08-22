// MainRoutes.tsx (đã sửa)
import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "@/pages/Home/Home";
import History from "@/pages/History/History";
const MapPage = lazy(() => import("@/pages/Map/Map"));
import AdminLayout from "@/app/layouts/AdminLayout/AdminLayout";
import Dashboard from "@/app/pages/Admin/Dashboard/Dashboard";
import NotFound from "@/app/components/NotFound";

export default function MainRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        {/* Public Routes - KHÔNG nằm trong AdminLayout */}
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
        <Route
          path="/map"
          element={
            <Suspense fallback={<div className="p-8 text-center">Đang tải…</div>}>
              <MapPage />
            </Suspense>
          }
        />

        {/* Admin Routes - nằm trong AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          {/* các route admin khác … */}
        </Route>

        {/* Redirect /dashboard -> /admin/dashboard */}
        <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}