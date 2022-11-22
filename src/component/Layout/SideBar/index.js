import React, { useState } from "react";
import { Link } from "react-router-dom";
import { routes } from "../../../constants";
import {
  closeIcon,
  dashboardIcon,
  historyIcon,
  menuIcon,
  portfolioIcon,
  securityIcon,
  settingIcon,
  supportIcon,
  walletIcon,
} from "../../../icons";
import "./css/Header.css";

const Header = ({ title }) => {
  // hide show header
  const [send, setSend] = useState(false);

  const handleToggle = () => {
    setSend(!send);
  };

  return (
    <>
      <section
        className={`zl_page_sidebar ${send ? "zl_hide_sidebar" : ""}`}
        title={title}
      >
        {/* {title} */}
        <div className="zl_page_sidebar_content">
          <div className="zl_page_sidebar_logo">
            <button
              className="zl_page_sidebar_toggle_btn"
              onClick={handleToggle}
            >
              {closeIcon}
            </button>
            <Link to={routes.dashboardPage}>
              <img
                src="assets/image/Logo.svg"
                alt="logo"
                className="img-fluid zl_main_logo"
              />
              <img
                src="assets/image/favicon.svg"
                alt="logo"
                className="img-fluid zl_mini_sidebar_logo"
              />
              <img
                src="assets/image/light-Logo.svg"
                alt="light-logo"
                className="img-fluid zl_light_theme_logo d-none"
              />
            </Link>
          </div>
          <ul className="zl_page_sidebar_nav">
            <li className="zl_page_sidebar_items" title="dashboard">
              <Link
                to={routes.dashboardPage}
                className="zl_page_sidebar_link position-relative"
              >
                {dashboardIcon}
                <span className="zl_pagesidebar_text">Dashboard</span>
              </Link>
            </li>
            <li className="zl_page_sidebar_items" title="portfolio">
              <Link
                to={routes.portfolioPage}
                className="zl_page_sidebar_link position-relative"
              >
                {portfolioIcon}
                <span className="zl_pagesidebar_text">Portfolio</span>
              </Link>
            </li>
            <li className="zl_page_sidebar_items" title="wallets">
              <Link
                to={routes.walletsPage}
                className="zl_page_sidebar_link position-relative"
              >
                {walletIcon}
                <span className="zl_pagesidebar_text">Wallets</span>
                <span className="zl_page_sidebar_notification_dot"></span>
              </Link>
            </li>
            <li className="zl_page_sidebar_items" title="history">
              <Link
                to={routes.historyPage}
                className="zl_page_sidebar_link position-relative"
              >
                {historyIcon}
                <span className="zl_pagesidebar_text">History</span>
              </Link>
            </li>
            <li className="zl_page_sidebar_items" title="securebackup">
              <Link
                to={routes.secureBackupPage}
                className="zl_page_sidebar_link position-relative"
              >
                {securityIcon}
                <span className="zl_pagesidebar_text">Security Backup</span>
              </Link>
            </li>
            <li className="zl_page_sidebar_items" title="settings">
              <Link
                to={routes.settingsPage}
                className="zl_page_sidebar_link position-relative"
              >
                {settingIcon}
                <span className="zl_pagesidebar_text">Settings</span>
              </Link>
            </li>
            {/* <li className="zl_page_sidebar_items" title="accountsupport">
              <Link
                to={routes.accountSupportPage}
                className="zl_page_sidebar_link position-relative"
              >
                {supportIcon}
                <span className="zl_pagesidebar_text">Account Support</span>
              </Link>
            </li> */}
          </ul>
          <button
            className="zl_page_sidebar_toggle_icon"
            onClick={handleToggle}
          >
            <img src="assets/image/right-two-arrow.svg" alt="right-two-arrow" />
          </button>
        </div>
      </section>
      <button className="zl_page_sidebar_toggle_btn" onClick={handleToggle}>
        {menuIcon}
      </button>
    </>
  );
};

export default Header;
