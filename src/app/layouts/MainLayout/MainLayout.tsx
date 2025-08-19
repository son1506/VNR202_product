import { Outlet } from "react-router";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";

const MainLayout = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen pt-[90px]">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default MainLayout;
