import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const MainLayout = () => {
  return (
    <>
      <div className="px-2 md:px-4 lg:px-12 xl:px-24">
          <Navbar />
      </div>

{/* px-4 md:px-8 lg:px-12 xl:px-24 mx-auto max-w-[1200px] */}
      <div className="px-4 md:px-8 lg:px-12 xl:px-24 mx-auto max-w-[1200px]">
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;
