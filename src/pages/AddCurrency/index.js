import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getBalanceAll
} from "../../store/slice/balanceSlice";
import HeadingModule from "../../component/Layout/Header";
import { InputGroup, FormControl, Form } from "react-bootstrap";
import { searchIcon } from "../../icons";
import { generateWalletForCrypto } from "../../helpers/wallet";
import { addCurrency } from "../../constantsData/addCurrency";

const AddCurrency = () => {
  const dispatch = useDispatch();
  const initialValue = () => {
    if (localStorage.getItem("checkCrypto")) {
      const tempCheck = {};
      JSON.parse(localStorage.getItem("checkCrypto"))?.forEach((i) => {
        tempCheck[i.currency] = true;
      });
      // console.log("tempCheck", tempCheck);
      return tempCheck;
    } else {
      return {
        [addCurrency[1].currency]: true,
      };
    }
  };
  const [filterData, setFilterData] = useState(addCurrency);
  const [check, setCheck] = useState(initialValue());
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const checkedObj = filterData
      .map((item) => (check[item.currency] === true ? item : null))
      .filter((item) => item !== null);
    // console.log("checkedObj", checkedObj, filterData);
    if (checkedObj.length !== 0) {
      localStorage.setItem("checkCrypto", JSON.stringify(checkedObj));
    } else {
      // if (!localStorage.getItem("checkCrypto")) {
      localStorage.setItem("checkCrypto", JSON.stringify([addCurrency[1]]));
      // }
    }
  }, [check, filterData]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    if (
      localStorage.getItem("checkCrypto") &&
      localStorage.getItem("mnemonics")
    ) {
      let resData = [];
      let errorForResData = [];
      let cryptoData = await JSON.parse(localStorage.getItem("checkCrypto"));

      let mnemonics = await JSON.parse(localStorage.getItem('mnemonics'));
      // console.log(mnemonics)
      for (let mnemonic of mnemonics) {
        let res = {};
        for (let crypto of cryptoData) {
          try {
            res[crypto.currency] = await generateWalletForCrypto(
              mnemonic,
              crypto.is_erc20 ? crypto.coin_name : crypto.currency
            );
          } catch (error) {
            errorForResData.push(error);
          }
        }
        resData.push(res);
      }
      if (errorForResData.length === 0) {
        localStorage.setItem(
          "user_crypto_currency_data",
          JSON.stringify(resData)
        );

        dispatch(getBalanceAll());
        // data.cb(null, resData);
      } else {
        // return data.cb(errorForResData[0], null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStorage.getItem("checkCrypto")]);

  const search = (event) => {
    event.preventDefault();
    const regex = new RegExp(event.target.value, "i");
    const filtered = addCurrency.filter((item) => {
      return (
        (item["coingecko_coin_name"].search(regex) &&
          item["coingecko_coin_name"].search(regex)) > -1
      );
    });
    setFilterData(filtered);
  };

  const checkHandler = (e) => {
    setCheck({
      ...check,
      [e.target.id]: e.target.checked,
    });
    setTimeout(() => {
      setRefresh(!refresh);
    }, 100);
  };

  return (
    <>
      <section className="zl_add_currency_page">
        <HeadingModule name={"Add Currency"} />
        <div className="zl_all_page_comman_content">
          <InputGroup className="zl_add_currency_search">
            <InputGroup.Text className="zl_add_currency_search_icon">
              {searchIcon}
            </InputGroup.Text>
            <FormControl placeholder="Search" type="text" onChange={search} />
          </InputGroup>
          <div className="zl_add_currency_row row">
            {filterData.map((currencyValue, i) => (
              <div
                className="zl_add_currency_column col"
                key={currencyValue.currency}
              >
                <div className="zl_add_currency_inner_content">
                  <div className="zl_add_currency_img">
                    <img
                      className="zl_currency_img"
                      src={currencyValue.image}
                      alt="currency-img"
                    />
                  </div>
                  <div className="zl_add_currency_text">
                    <h3>{currencyValue.currency}</h3>
                    <p>{currencyValue.coingecko_coin_name}</p>
                  </div>
                  <Form.Check
                    type="switch"
                    id={currencyValue.currency}
                    label=""
                    // disabled={currencyValue.currency === "ETH"}
                    className="zl_custom_currency_checkbox custom-switch"
                    onChange={(e) => checkHandler(e)}
                    checked={
                      localStorage.getItem("checkCrypto")
                        ? JSON.parse(localStorage.getItem("checkCrypto")).some(
                          (item) => {
                            if (
                              item.currency === currencyValue.currency &&
                              !!check[currencyValue.currency]
                            )
                              return true;
                          }
                        )
                          ? true
                          : false
                        : !!check[currencyValue.currency]
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default AddCurrency;
