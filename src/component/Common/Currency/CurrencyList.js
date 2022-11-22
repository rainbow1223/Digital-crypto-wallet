import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { routes } from "../../../constants";
import { Nav } from "react-bootstrap";
import {
  currencyPriceDetail,
  getBalance,
  getErc20Balance,
  clearBalance,
  getBalanceAll,
  deleteAccounts
} from "../../../store/slice/balanceSlice";
import { setCurrentAccount } from '../../../store/slice/authSlice';
import Spinner from "react-bootstrap/Spinner";
import CurrencyBlock from "./CurrencyBlock";
import { getCoinChart } from "../../../store/slice/chartSlice";
import { getCoinMarketDetail } from "../../../store/slice/coinMarketSlice";

import { Table, Button, FormCheck } from 'react-bootstrap';
import { toast } from "react-toastify";

export const CurrencyTable = ({ setTotalAllBalance }) => {
  const dispatch = useDispatch();
  const [isAccountSelected, setIsAccountSelected] = useState([]);
  const [totalBalances, setTotalBalances] = useState([]);
  const currency = localStorage.getItem("currency");
  const cryptoCoins = JSON.parse(localStorage.getItem("checkCrypto"));
  const userCurrency = JSON.parse(
    localStorage.getItem("user_crypto_currency_data")
  );

  const selectAllHandler = () => {
    if (isAccountSelected.filter(account => !account).length > 0)
      setIsAccountSelected(isAccountSelected.map(account => true));
    else
      setIsAccountSelected(isAccountSelected.map(account => false));
  }

  const zeroBalanceHandler = () => {
    setIsAccountSelected(totalBalances.map(balance => (balance === 0 ? true : false)));
  }

  const deleteHandler = () => {
    if (isAccountSelected.filter(account => !account).length === 0) {
      toast.warning("You cannot delete all accounts!", { autoClose: 2000 })
    } else if (isAccountSelected.filter(account => account).length === 0) {
      toast.warning("Please select one more account.", { autoClose: 2000 })
    } else {
      dispatch(deleteAccounts({ isAccountSelected: [...isAccountSelected] }));
    }
  }

  const refreshHandler = () => {
    dispatch(getBalanceAll());
  }

  const balanceAll = useSelector((state) => state.balance.balanceAll);
  const currencyVal = useSelector((state) => state.balance.currencyPrice);
  useEffect(() => {
    // console.log('abcde')
    setIsAccountSelected(Array(balanceAll.length).fill(false));
    let total = Array(balanceAll.length).fill(0);

    for (let i = 0; i < balanceAll.length; i++) {
      let { balance, erc20Balance } = balanceAll[i];
      let coinBalance = [...balance, ...erc20Balance];
      // console.log('abce', coinBalance)
      for (let j = 0; j < coinBalance.length; j++) {
        if (!coinBalance[j]) {
          continue;
        } else {
          total[i] += coinBalance[j].fiat_balance;
        }
      }
    }
    setTotalBalances(total);
    setTotalAllBalance(total.reduce((a, b) => a + b, 0));
  }, [balanceAll]);

  // console.log('test', balanceAll);
  useEffect(() => {
    if (balanceAll.length === 0)
      dispatch(getBalanceAll());
  }, [dispatch, currency]);

  const loading = useSelector(state => state.balance.balanceAllLoader);
  // console.log('loading', loading)
  if (loading) return (<div><Spinner animation="border" variant="primary" /></div>);
  return (
    <>
      <div className="row justify-content-end">
        <div className="mx-2"><Button variant="secondary" onClick={zeroBalanceHandler}>0 balance</Button></div>
        <div className="mx-2"><Button variant="secondary" onClick={selectAllHandler}>Select All</Button></div>
        <div className="mx-2"><Button variant="outline-danger" onClick={deleteHandler}>Delete</Button></div>
      </div>

      <Table striped bordered hover responsive>
        <thead className="table_title__color">
          <tr>
            <th>Account</th>
            {cryptoCoins.map((cryptoCoin, index) => {
              return (
                <th key={index}>
                  <img src={cryptoCoin.image} alt={cryptoCoin?.name} />
                  {cryptoCoin.currency}
                </th>
              );
            })}
            <th>total Amount</th>
            <th></th>
          </tr>
        </thead>
        <tbody className="table_text__color">
          {userCurrency.map((accountBalance, index) => {
            return (
              <CurrencyTr
                account={index}
                key={index}
                // totalBalance={totalAllBalance[index]}
                // setTotalBalance={(val) => setTotalAllBalance(totalBalance => {
                //   let totalBalance_ = [...totalBalance];
                //   totalBalance_[index] = val;
                //   return totalBalance_;
                // })}
                totalBalances={totalBalances}
                isAccountSelected={isAccountSelected}
                setIsAccountSelected={() => setIsAccountSelected(accounts => {
                  let accounts_ = [...accounts];
                  accounts_[index] = !accounts_[index];
                  return accounts_;
                })}
              />
            );
          })}
        </tbody>
      </Table>
      <Button onClick={refreshHandler}>refresh</Button>
    </>
  );
}

const CurrencyTr = ({ account, totalBalances, isAccountSelected, setIsAccountSelected }) => {
  const dispatch = useDispatch();
  const ref = useRef();
  const navigate = useNavigate();

  const [balanceArr, setBalanceArr] = useState([]);

  const cryptoCoins = JSON.parse(localStorage.getItem("checkCrypto"));


  const balance = useSelector((state) => state.balance.balanceAll[account]?.balance);

  const erc20Balance = useSelector((state) => state.balance.balanceAll[account]?.erc20Balance);
  let coinBalance = [];
  if (balance && erc20Balance)
    coinBalance = [...balance, ...erc20Balance];
  // console.log("coinBalance", coinBalance, "bal", balance, "erc", erc20Balance);
  const currencyVal = useSelector((state) => state.balance.currencyPrice);
  useEffect(async () => {

    if (currencyVal && ref.current) {
      // setTimeout(() => {
      ref.current = false;
      // }, 1500);
    }
  }, [currencyVal]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setTemp(false);
  //   }, 3000);
  // }, [window]);

  useEffect(() => {
    let balanceArray = [];
    // console.log('abcde', cryptoCoins, coinBalance)
    if (currencyVal && cryptoCoins.length === coinBalance.length) {
      // console.log('cryptocoins', cryptoCoins)
      if (cryptoCoins) {
        for (let i = 0; i < cryptoCoins.length; i++) {
          let obj = cryptoCoins[i];
          balanceArray.push({
            id: i + 1,
            coingecko_coin_name: obj.coingecko_coin_name,
            is_erc20: obj.is_erc20,
            name: obj.currency,
            balance: obj.is_erc20
              ? erc20Balance?.filter(
                (item) => item?.name === obj.display_currency
              )[0]
              : balance?.filter((item) => item?.name === obj.display_currency)[0],
            updown: "+12,5%",
            class: "zl_add_bitcoin_currency",
          });
        }
      }
      // if (!temp) {
      setBalanceArr(balanceArray);
      // console.log('total', balanceArray?.reduce((a, b) => (a + parseFloat(b.balance.fiat_balance ? b.balance.fiat_balance : 0)), 0))
      // setTotalBalance(balanceArray?.reduce((a, b) => (a + parseFloat(b.balance.fiat_balance ? b.balance.fiat_balance : 0)), 0))
    }
  }, [currencyVal, balance, erc20Balance]);

  // console.log("balanceArray", balanceArr, cryptoCoins);
  return (
    <tr>
      <td onClick={() => { dispatch(setCurrentAccount(account)); navigate(routes.walletsPage); }}>account{account}</td>
      {balanceArr?.map((crypto, index) => {
        return (
          <td key={index} onClick={() => { dispatch(setCurrentAccount(account)); navigate(routes.walletsPage); }}>
            {/* {JSON.stringify(crypto)} */}
            <div>{crypto.balance.balance}</div>
            <div>${crypto.balance.fiat_balance}</div>
          </td>
        );
      })}
      <td onClick={() => { dispatch(setCurrentAccount(account)); navigate(routes.walletsPage); }}>${totalBalances[account]}</td>
      {/* <td>${balanceArr?.reduce((a, b) => (a + parseFloat(b.balance.fiat_balance ? b.balance.fiat_balance : 0)), 0)}</td> */}
      <td onClick={() => { dispatch(setCurrentAccount(account)); navigate(routes.walletsPage); }}></td>
      <td
        // onClick={setIsAccountSelected}
        style={{ cursor: 'pointer' }}
      >
        <FormCheck checked={isAccountSelected[account] ? isAccountSelected[account] : false} onChange={setIsAccountSelected} />
      </td>
    </tr>
  );
}

export const CurrencyList = ({ nav, setTotalBalance, updateBalance }) => {
  const dispatch = useDispatch();
  const ref = useRef();

  const [balanceArr, setBalanceArr] = useState([]);
  // const [temp, setTemp] = useState(false);

  const currency = localStorage.getItem("currency");
  const cryptoCoins = JSON.parse(localStorage.getItem("checkCrypto"));
  // console.log("cryptoCoins", cryptoCoins);
  const userCurrency = JSON.parse(
    localStorage.getItem("user_crypto_currency_data")
  );
  // console.log("userCurrencyAll", userCurrency, cryptoCoins);

  const coinName = cryptoCoins
    ?.map((item, i) => item.coingecko_coin_name)
    .toString();

  const balance = useSelector((state) => state.balance.balance);

  const erc20Balance = useSelector((state) => state.balance.erc20Balance);

  const currentAccount = useSelector((state) => state.auth.currentAccount);
  // console.log("userCurrency", userCurrency[currentAccount]);

  const coinBalance = [...balance, ...erc20Balance];
  // console.log("coinBalance", coinBalance, "bal", balance, "erc", erc20Balance);
  const currencyVal = useSelector((state) => state.balance.currencyPrice);
  // console.log("currencyVal", currencyVal);

  useEffect(() => {
    dispatch(currencyPriceDetail({ coins: coinName, currency: currency }));
    ref.current = true;
  }, [dispatch, currency, currentAccount]);

  useEffect(() => {
    let total = 0;

    if (coinBalance.length === cryptoCoins.length) {
      for (let i = 0; i < coinBalance.length; i++) {
        if (!coinBalance[i]) {
          continue;
        } else {
          total += coinBalance[i].fiat_balance;
        }
      }
    }

    updateBalance && setTotalBalance(total);
  }, [coinBalance, cryptoCoins, erc20Balance, updateBalance, currencyVal, currentAccount]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    dispatch(clearBalance());

    if (currencyVal && ref.current) {
      // setTimeout(() => {
      for (let i = 0; i < cryptoCoins.length; i++) {
        if (!cryptoCoins[i].is_erc20) {
          dispatch(
            getBalance({
              coin_type: cryptoCoins[i]?.coin_type,
              address: userCurrency[currentAccount][cryptoCoins[i].currency]?.address,
              // address: userCurrency[cryptoCoins[i].currency]?.address,
              coin: cryptoCoins[i]?.tatum_coin_name,
              account: currentAccount
            })
          );
        } else {
          dispatch(
            getErc20Balance({
              address: userCurrency[currentAccount][cryptoCoins[i]?.currency]?.address,
              // address: userCurrency[cryptoCoins[i]?.currency]?.address,
              contract_address: cryptoCoins[i]?.contract_address,
              testnet_type: cryptoCoins[i]?.testnet_type,
              token: cryptoCoins[i]?.currency,
              digits: cryptoCoins[i]?.digits,
              coin: cryptoCoins[i]?.coin_name,
              account: currentAccount
            })
          );
        }
      }
      ref.current = false;
      // }, 1500);
    }
  }, [currencyVal]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setTemp(false);
  //   }, 3000);
  // }, [window]);

  useEffect(() => {
    let balanceArray = [];
    if (currencyVal && cryptoCoins.length === coinBalance.length) {
      cryptoCoins?.forEach((obj, i) => {
        balanceArray.push({
          id: i + 1,
          image: obj.image,
          coingecko_coin_name: obj.coingecko_coin_name,
          is_erc20: obj.is_erc20,
          name: obj.currency,
          balance: obj.is_erc20
            ? erc20Balance?.filter(
              (item) => item?.name === obj.display_currency
            )[0]
            : balance?.filter((item) => item?.name === obj.display_currency)[0],
          updown: "+12,5%",
          class: "zl_add_bitcoin_currency",
        });
        return true;
      });
      // if (!temp) {
      setBalanceArr(balanceArray);
      // }
      // if (
      //   balanceArray.length === cryptoCoins.length &&
      //   balanceArray.length > 0
      // ) {
      //   setTemp(true);
      //   return;
      // }
    }
  }, [currencyVal, balance, erc20Balance]);

  // console.log("balanceArray", balanceArr, cryptoCoins);

  const date = +new Date().getTime();
  const toDate = (date / 1000).toFixed(0);
  const fromDate = toDate - 86400;

  useEffect(() => {
    dispatch(getCoinMarketDetail(coinName));
  }, [dispatch]);

  const coinMarketData = useSelector((state) => state.coinMarket.coinMarket);

  useEffect(() => {
    for (let i = 0; i < cryptoCoins.length; i++) {
      dispatch(
        getCoinChart({
          coin: cryptoCoins[i].coingecko_coin_name,
          from_date: fromDate,
          to_date: toDate,
        })
      );
    }
  }, [dispatch]);

  const chartData = useSelector((state) => state.chart.chartSmall);

  return (
    <>
      {balanceArr?.map((crypto, index) => {
        return (
          <div key={index}>
            {nav ? (
              <Nav.Item className="zl_add_currency_column col" key={index}>
                <Nav.Link
                  eventKey={crypto.name}
                  className="zl_add_currency_inner_content zl_add_bitcoin_currency"
                >
                  {chartData && balanceArr.length > 0 && (
                    <CurrencyBlock
                      coinMarketData={coinMarketData}
                      crypto={crypto}
                      chartData={chartData}
                      key={index}
                    />
                  )}
                </Nav.Link>
              </Nav.Item>
            ) : (
              <div className="zl_add_currency_column col" key={index}>
                <div className="zl_add_currency_inner_content">
                  {chartData && balanceArr.length > 0 && (
                    <CurrencyBlock
                      coinMarketData={coinMarketData}
                      crypto={crypto}
                      chartData={chartData}
                      key={index}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};
