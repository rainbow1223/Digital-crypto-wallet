import React, { useState, useEffect } from "react";
import HeadingModule from "../../component/Layout/Header";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import { routes } from "../../constants";
import { CurrencyList, CurrencyTable } from "../../component/Common/Currency/CurrencyList";
// import {}\
import { useSelector } from "react-redux";

const Dashboard = () => {
  // localStorage.clear()
  console.log('loaded')
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalAllBalance, setTotalAllBalance] = useState([]);

  // console.log('totalBalance', totalAllBalance)
  return (
    <>
      <section className="zl_dashboard_page">
        <HeadingModule name={"Dashboard"} />
        <div className="zl_all_page_comman_content">
          <CurrencyTable setTotalAllBalance={setTotalAllBalance} />

          <div className="zl_all_page_comman_total_price">
            <p className="zl_all_page_total_price_heading">Total Revenue</p>
            <h2 className="zl_all_page_total_price_text">
              {/* ${totalBalance.toFixed(4)} */}
              ${totalAllBalance}
            </h2>
          </div>
        </div>
        <div className="zl_add_currency_content">
          <h3 className="zl_bottom_content_heading">Wallets</h3>
          <div className="zl_add_currency_row row">
            <CurrencyList
              setTotalBalance={setTotalBalance}
              updateBalance={true}
            />
            <div className="zl_add_currency_column col">
              <Link
                to={routes.addCurrencyPage}
                className="zl_add_currency_btn_content"
              >
                + Add Currency
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* )} */}

    </>
  );
};

export default Dashboard;
