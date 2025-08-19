import { Layout } from "antd";
import { Outlet } from "react-router";
import Sidebar from "./partials/Sidebar";

const AdminLayout = () => {
  return (
    <Layout className="h-screen">
      <Sidebar />
      <Layout className="overflow-y-scroll small-scrollbar border-l border-zinc-400 bg-secondary/30">
        <div className="mx-14 my-10">
          <Outlet />
        </div>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
