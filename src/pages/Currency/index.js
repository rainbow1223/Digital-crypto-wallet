import React, { useEffect, useState } from "react";
import { InputGroup, FormControl } from "react-bootstrap";
import HeadingModule from "../../component/Layout/Header";
import { searchIcon } from "../../icons";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "../../constants";

const Currency = () => {
  const navigate = useNavigate();

  const currencyList = [
    {
      image: "USA.png", // Currency image
      currency: "USD", // Currency name which is supported by Coingecko
      currency_type: "American Dollar", // Currency type
    },
    {
      image: "Canada.png",
      currency: "CAD",
      currency_type: "Canadian Dollar",
    },
    {
      image: "EUROPE.png",
      currency: "EUR",
      currency_type: "Europe",
    },
    {
      image: "Australia.png",
      currency: "AUD",
      currency_type: "Australian Dollar",
    },
    {
      image: "Switzerland.png",
      currency: "CHF",
      currency_type: "Swiss France",
    },
    // {
    //   image: "Germany.png",
    //   currency: "DEM",
    //   currency_type: "Germany",
    // },
    {
      image: "China.png",
      currency: "CNY",
      currency_type: "Chinese Yuan",
    },
    {
      image: "Brazil.png",
      currency: "BRL",
      currency_type: "Brazilian Real",
    },
    // {
    //   image: "France.png",
    //   currency: "EURO",
    //   currency_type: "France",
    // },
    // {
    //   image: "England.png",
    //   currency: "AUD",
    //   currency_type: "England",
    // },
    // {
    //   image: "HongKong.png",
    //   currency: "BRL",
    //   currency_type: "Hong Kong",
    // },
    {
      image: "India.png",
      currency: "INR",
      currency_type: "India",
    },
    // {
    //   image: "Japan.png",
    //   currency: "CHF",
    //   currency_type: "Japan",
    // },
    // {
    //   image: "Kuwait.png",
    //   currency: "CNY",
    //   currency_type: "Kuwait",
    // },
    // {
    //   image: "SriLanka.png",
    //   currency: "DEM",
    //   currency_type: "Sri Lanka",
    // },
    // {
    //   image: "Maldives.png",
    //   currency: "EURO",
    //   currency_type: "Maldives",
    // },
    // {
    //   image: "Norway.png",
    //   currency: "EURO",
    //   currency_type: "Norway",
    // },
  ];

  const [cur, setCur] = useState([]);

  useEffect(() => {
    setCur(currencyList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const searchCurrencyHandler = (e) => {
    let tempCur = [];
    currencyList.filter((curVal, i) =>
      curVal.currency.indexOf(e.target.value) > -1 ? tempCur.push(curVal) : null
    );
    return setCur(tempCur);
  };

  return (
    <>
      <section className="zl_currency_page">
        <HeadingModule name={"Currency"} />
        <div className="zl_all_page_comman_content">
          <InputGroup className="zl_add_currency_search">
            <InputGroup.Text className="zl_add_currency_search_icon">
              {searchIcon}
            </InputGroup.Text>
            <FormControl
              placeholder="Search"
              type="text"
              onChange={searchCurrencyHandler}
            />
          </InputGroup>
          <div className="zl_add_currency_row row">
            {cur?.map((item, index) => {
              return (
                <Link
                  to={routes.settingsPage}
                  onClick={() => {
                    navigate(-1);
                    localStorage.setItem("currency", item.currency);
                  }}
                  className={`zl_add_currency_column col`}
                  key={index}
                >
                  <div className="zl_add_currency_column col unactive">
                    <div className="zl_add_currency_inner_content">
                      <div className="zl_add_currency_img">
                        <img
                          src={`assets/image/${item.image}`}
                          alt="currency-img"
                        />
                      </div>
                      <div className="zl_add_currency_text">
                        <h3>{item.currency}</h3>
                        <p>{item.currency_type}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default Currency;
