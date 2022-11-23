import React, { useEffect, useState } from "react";
import HeadingModule from "../../component/Layout/Header";
import { Tab, Nav } from "react-bootstrap";
import { CurrencyList } from "../../component/Common/Currency/CurrencyList";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../component/Common/Loader";
import {
  clearTransactions,
  getTransactions,
  getErc20Transactions,
} from "../../store/slice/transactionSlice";
import CmnTransactions from "../../component/Layout/TransactionList/CmnTransactions";

const History = () => {
  const [key, setKey] = useState("tab1");
  const cryptoCoins = JSON.parse(localStorage.getItem("checkCrypto"));

  const userCurrency = JSON.parse(
    localStorage.getItem("user_crypto_currency_data")
  );
  const dispatch = useDispatch();

  const [allTransaction, setAllTransaction] = useState([]);

  const transactions = useSelector((state) => state.transactions.transactions);

  let tempAllTransactions = [];
  useEffect(() => {
    for (const trans in transactions) {
      transactions[trans] && tempAllTransactions.push(transactions[trans]);
    }

    if (cryptoCoins.length === tempAllTransactions.length) {
      setAllTransaction(tempAllTransactions);
    }
  }, [transactions]);

  let valueCoin = cryptoCoins.filter((obj) => obj.currency === key)[0];

  const [walletTransaction, setWalletTransaction] = useState([]);

  useEffect(() => {
    if (valueCoin?.is_erc20) {
      // window[valueCoin?.name + "Transactions"] =
      setWalletTransaction(transactions[valueCoin?.contract_address]);
    } else {
      // window[valueCoin?.name + "Transactions"] =
      setWalletTransaction(transactions[valueCoin?.coingecko_coin_name]);
    }
    // setWalletTransaction(window[valueCoin?.name + "Transactions"]);
  }, [transactions, valueCoin?.currency]);

  const loader = useSelector((state) => state.transactions.loader);
  const currentAccount = useSelector((state) => state.auth.currentAccount);
  let value;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    if (key !== "tab1") {
      value = cryptoCoins.filter((obj) => obj.currency === key)[0];
      let currencyAddress = JSON.parse(
        localStorage.getItem("user_crypto_currency_data")
      )[currentAccount][value.currency]?.address;

      dispatch(
        value?.is_erc20
          ? getErc20Transactions({
            currentAccount: currentAccount,
            address: currencyAddress,
            chain: value?.chain,
            contract_address: value?.contract_address,
          })
          : getTransactions({
            coin_type: value.coin_type,
            coin: value.coingecko_coin_name,
            chain: value.moralis_api_chain,
            currentAccount: currentAccount,
            address: currencyAddress,
          })
      );
    } else {
      dispatch(clearTransactions());

      for (let i = 0; i < cryptoCoins.length; i++) {
        if (!cryptoCoins[i].is_erc20) {
          dispatch(
            getTransactions({
              coin_type: cryptoCoins[i].coin_type,
              coin: cryptoCoins[i].coingecko_coin_name,
              chain: cryptoCoins[i].moralis_api_chain,
              currentAccount: currentAccount,
              address: userCurrency[currentAccount][cryptoCoins[i].currency]?.address,
            })
          );
        } else {
          dispatch(
            getErc20Transactions({
              currentAccount: currentAccount,
              address: userCurrency[currentAccount][cryptoCoins[i].currency]?.address,
              chain: cryptoCoins[i]?.chain,
              contract_address: cryptoCoins[i]?.contract_address,
            })
          );
        }
      }
    }
  }, [key, currentAccount]);

  // console.log('Transaction', allTransaction)
  return (
    <>
      {loader && <Loader />}
      <section className="zl_history_page">
        <HeadingModule name={"History"} />
        <Tab.Container
          id="left-tabs-example"
          activeKey={key}
          onSelect={(k) => setKey(k)}
        >
          <div className="zl_add_currency_content">
            <h3 className="zl_bottom_content_heading">Activities</h3>
            <Nav className="zl_add_currency_row row">
              <Nav.Item className="zl_add_currency_column col">
                <Nav.Link eventKey="tab1" className="zl_all_currency_content">
                  All currency
                </Nav.Link>
              </Nav.Item>
              <CurrencyList nav={true} numStart={1} />
            </Nav>
          </div>

          {key !== "tab1" ? (
            <CmnTransactions transactions={walletTransaction} />
          ) : (
            <CmnTransactions allTransactions={allTransaction} />
          )}
        </Tab.Container>
      </section>
    </>
  );
};

export default History;
