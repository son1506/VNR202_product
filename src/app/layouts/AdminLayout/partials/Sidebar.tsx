import { Menu } from "antd";

import {
  GlobalOutlined,
  HomeOutlined
} from "@ant-design/icons";
import { Layout } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Logo from "@/app/components/Logo";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const activeItemStyle = "!bg-sky-600 !text-white hover:!bg-sky-500";
  const itemStyle = "w-full flex hover:!bg-sky-600 !text-zinc-600 hover:!text-white";

  const [selectedKey, setSelectedKey] = useState("/dashboard");

  useEffect(() => {
    const path = location.pathname;

    if (path.includes("/dashboard")) {
      setSelectedKey("/dashboard");
    } else if (path.includes("/Products")) {
      setSelectedKey("/Products");
    } else {
      setSelectedKey("/dashboard");
    }
  }, [location.pathname]);

  const navItems = [
    {
      label: "Dashboard",
      key: "/dashboard",
      path: "/dashboard",
      className: selectedKey === "/dashboard" ? activeItemStyle : itemStyle,
      icon: <HomeOutlined />,
    },
    {
      label: "Quản Lý Products",
      key: "/Products",
      path: "/Products",
      className: selectedKey === "/Products" ? activeItemStyle : itemStyle,
      icon: <GlobalOutlined />,
    },
  ];

  return (
    <Layout.Sider
      collapsible
      collapsed={isCollapsed}
      onCollapse={(value) => setIsCollapsed(value)}
      className="!bg-white pt-4"
      width={250}
    >
      <div className="px-6 mb-6 flex justify-between items-center">
        <Logo collapsed={isCollapsed} className="!text-black" />
      </div>
      <Menu
        className="mt-4 px-2 bg-white"
        selectedKeys={[selectedKey]}
        mode="vertical"
        items={navItems}
        onClick={({ key }) => navigate(key)}
      />
    </Layout.Sider>
  );
};

export default Sidebar;
