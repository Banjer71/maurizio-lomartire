import React from "react";
import Navbar from "../navbar/navbar";
import Content from "../content/index";
import SideBar from "../sidebar";

const MainTemplate = () => {
  return (
    <div className="main-template">
      <Navbar />
      <Content />
      <SideBar />
    </div>
  );
};

export default MainTemplate;
