import React, { useEffect, useState } from "react";
import Settings from "../../pages/Settings";

import Sidebar from "./SideBar/index";

const Layout = ({ children }) => {
  const [color, setColor] = useState("zl_light_theme_active");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setColor(localStorage.getItem("themColor"));
      !localStorage.getItem("currency") &&
        localStorage.setItem("currency", "USD");
    }
  }, []);

  const themHandler = (val) => {
    setColor(val ? "zl_light_theme_active" : "zl_page_dark_mode");
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "themColor",
        val ? "zl_light_theme_active" : "zl_page_dark_mode"
      );
    }
  };

  const url = window.location.pathname;
  const title = url.split("/")[1];

  return (
    <div
      className={`zl_all_pages_content ${color === null ? "zl_light_theme_active" : color
        }`}
    >
      <Sidebar title={title} />
      <div className="zl_all_pages_inner_content">
        {url === "/settings" ? (
          <Settings themHandler={themHandler} />
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default Layout;
