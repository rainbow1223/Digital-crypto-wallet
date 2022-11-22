import React, { useState } from "react";
import { Link } from "react-router-dom";
import { routes } from "../../../constants";
import { useDispatch, useSelector } from "react-redux";
import { logout, setCurrentAccount } from "../../../store/slice/authSlice";
import { clearBalanceAll } from "../../../store/slice/balanceSlice";
import { Dropdown } from "react-bootstrap";

const Header = (props) => {
  const dispatch = useDispatch();
  const currentAccount = useSelector((state) => state.auth.currentAccount);

  const balanceAll = useSelector((state) => state.balance.balanceAll);

  const logoutHandler = () => {
    dispatch(logout());
    dispatch(clearBalanceAll());
  };

  return (
    <>
      <div className="zl_all_page_heading_section">
        <div className="zl_all_page_heading">
          <h2>{props.name}</h2>
          {/* <p>Lorem Ipsum is simply dummy text of the printing & industry.</p> */}
        </div>

        <div className="zl_all_page_notify_logout_btn">
          <Dropdown>
            <Dropdown.Toggle>
              account{currentAccount}
            </Dropdown.Toggle>

            <Dropdown.Menu style={{ minWidth: 'auto' }}>
              {balanceAll.map((balance, index) => (
                <Dropdown.Item key={index} onSelect={() => dispatch(setCurrentAccount(index))}>account{index}</Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Link
            to={routes.welcomePage}
            onClick={logoutHandler}
            className="zl_all_page_logout_btn"
          >
            Log Out
          </Link>
        </div>
      </div>
    </>
  );
};

export default Header;
