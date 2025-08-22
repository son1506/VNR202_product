import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "./partials/Sidebar";

const { Content } = Layout;

const AdminLayout = () => {
  return (
    <Layout className="h-screen">
      <Sidebar />
      <Layout className="overflow-y-scroll small-scrollbar border-l border-zinc-400 bg-secondary/30">
        <Content className="mx-14 my-10">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
