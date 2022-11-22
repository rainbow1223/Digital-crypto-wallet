import React, { useEffect, useState } from "react";
import { copyLargeIcon, receiveBlueIcon, sendBlueIcon } from "../../../icons";
import { Button } from "react-bootstrap";
import QRCode from "qrcode.react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { coinBasedTokenBalance } from "../../../store/slice/balanceSlice";

const TransactionForm = ({
  keyCoin,
  coin_type,
  coingecko_coin_name,
  display_currency,
  is_erc20,
  coin_name,
  tatum_coin_name,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [insertAddress, setInsertAddress] = useState("");
  const [addressErr, setAddressErr] = useState("");
  const [insertAmount, setInsertAmount] = useState("");
  const [amountErr, setAmountErr] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [fee, setFee] = useState(0);
  const [feeErr, setFeeErr] = useState("");

  const currency = localStorage.getItem("currency")?.toLowerCase();
  // console.log(
  //   "currencyKKK",
  //   keyCoin,
  //   coin_type,
  //   is_erc20,
  //   coin_name,
  //   currency,
  //   tatum_coin_name
  // );

  useEffect(() => {
    if (is_erc20) {
      dispatch(
        coinBasedTokenBalance({
          coin_type: "ethereum",
          address: JSON.parse(
            localStorage.getItem("user_crypto_currency_data")
          )[currentAccount][keyCoin]?.address,
          coin: tatum_coin_name,
        })
      );
    }
  }, [currency, dispatch, is_erc20, tatum_coin_name]);

  const tokenBasedCoinBalance = useSelector(
    (state) => state.balance.tokenBalance
  )?.[tatum_coin_name];

  // console.log("tokenBasedCoinBalance", tokenBasedCoinBalance);

  const coinsPrice = useSelector((state) => state.balance.currencyPrice);
  const coinPrice =
    coinsPrice &&
    currency &&
    coinsPrice[coingecko_coin_name] &&
    coinsPrice[coingecko_coin_name][currency];
  // console.log("coinPrice", coinsPrice, coinPrice);

  const cryptoCoins = JSON.parse(localStorage.getItem("checkCrypto"));

  const allCoinBalance = useSelector((state) => state.balance.balance);
  const erc20Balance = useSelector((state) => state.balance.erc20Balance);
  const balance = [...allCoinBalance, ...erc20Balance];
  console.log("coinBalance**", keyCoin, balance);

  // const tokenBasedCoinBalance =
  //   coin_name &&
  //   balance.length === cryptoCoins.length &&
  //   !balance.includes(undefined) &&
  //   balance?.filter(
  //     (item) => (item.name === "BNB" ? "BSC" : item.name) === coin_name
  //   )[0]?.balance;
  // console.log("tokenBasedCoinBalance", tokenBasedCoinBalance);

  const coinBalance =
    balance.length === cryptoCoins.length &&
    !balance.includes(undefined) &&
    balance?.filter((item) => item.name === display_currency)[0]?.balance;
  console.log("coinBalance", keyCoin, coinBalance, balance);

  const currentAccount = useSelector((state) => state.auth.currentAccount);
  const transactionAddress =
    localStorage.getItem("user_crypto_currency_data") &&
    JSON.parse(localStorage.getItem("user_crypto_currency_data"))[currentAccount][`${keyCoin}`]
      ?.address;

  const calculateTransactionFees = async () => {
    const coinClass = (await import(`../../CurrencyHelpers/${keyCoin}`))
      .default;
    const coin = await new coinClass({
      amount: insertAmount,
      to: insertAddress,
      balance: coinBalance,
      currentAccount: currentAccount
    });
    // console.log('key-coin', keyCoin)
    // console.log("coin%$%$", insertAmount, insertAddress, coinBalance);
    return coin.TransactionFees();
  };

  const insertAddressHandler = (e) => {
    setInsertAddress(e.target.value);
    setAddressErr("");
  };

  const insertAmountHandler = async (e) => {
    setFeeErr("");
    setInsertAmount(e.target.value);
    console.log("e.target", parseFloat(+e.target.value), coinBalance);
    if (
      e.target.value === "" ||
      e.target.value === "0" ||
      parseFloat(+e.target.value) === 0
    ) {
      // console.log("in0", e.target.value);
      setFee(0);
      setTotalAmount(0);
      return;
    }

    if (parseFloat(+e.target.value) >= +coinBalance) {
      setFeeErr("Value must not be larger than your balance");
      setFee(0);
      setTotalAmount(0);
      return;
    }

    // const coinClass = (await import(`../../CurrencyHelpers/${keyCoin}`))
    //   .default;
    // const coin = await new coinClass({
    //   amount: e.target.value,
    //   to: insertAddress,
    //   balance: coinBalance,
    // });
    // console.log("coin.Tra", coin, coinClass);
    // const totalFees = await calculateTransactionFees(e.target.value);
    // // console.log("totalFees", totalFees);
    // let feeNum;
    // if (coin_type === "bitcoin") {
    //   feeNum = totalFees;
    // } else {
    //   feeNum = totalFees.gasLimit * totalFees.gasPrice * 10 ** -9;
    // }
    // const totalAmountTrans = +coinPrice * +e.target.value + +feeNum;
    // console.log("totalAmountTrans", totalAmountTrans);
    // setTotalAmount(totalAmountTrans);
    // // console.log("feeNum", feeNum);
    // setFee(feeNum);
    setAmountErr("");
  };

  // console.log("fee", fee);

  const validate = () => {
    let isValid = false;
    if (!insertAddress) {
      setAddressErr("Address is required !");
    } else if (!insertAmount) {
      setAmountErr("Amount is required !");
    } else {
      setAddressErr("");
      setAmountErr("");
      isValid = true;
    }
    return isValid;
  };

  useEffect(() => {
    async function calculateFee() {
      // console.log('fd')
      if (validate()) {
        const transactionFees = await calculateTransactionFees();
        console.log("transactionFees$%$%", transactionFees);

        // const totalFees = await calculateTransactionFees(e.target.value);
        // console.log("totalFees", totalFees);
        let feeNum;
        if (coin_type === "bitcoin") {
          feeNum = transactionFees;
        } else {
          feeNum =
            transactionFees.gasLimit * transactionFees.gasPrice * 10 ** -9;
        }
        let totalAmountTrans;
        // console.log(
        //   "%^&*",
        //   +(+coinPrice * +insertAmount + +feeNum).toFixed(0),
        //   +(+coinPrice * +coinBalance).toFixed(0)
        // );
        if (
          +(+coinPrice * +insertAmount + +feeNum).toFixed(0) ===
          +(+coinPrice * +coinBalance).toFixed(0)
        ) {
          totalAmountTrans = +coinPrice * +coinBalance - feeNum;
          // console.log(
          //   "#$%^&*()(*&",
          //   totalAmountTrans,
          //   +coinPrice * +insertAmount - feeNum
          // );
        } else {
          totalAmountTrans = +coinPrice * +insertAmount + +feeNum;
          // console.log("#$%^&*()(*&*******", totalAmountTrans);
        }
        // console.log(
        //   "totalAmountTrans",
        //   totalAmountTrans,
        //   "fee",
        //   feeNum,
        //   "amount",
        //   insertAmount,
        //   "+coinPrice * +insertAmount",
        //   +coinPrice * +insertAmount,
        //   "coinprice",
        //   coinPrice
        // );
        setTotalAmount(totalAmountTrans);
        // console.log("feeNum", feeNum);
        setFee(feeNum);
      }
    }
    insertAddress && insertAmount && calculateFee();
    console.log(insertAmount)
  }, [insertAmount]);

  console.log("totalAmount", totalAmount);
  console.log("fee", fee);

  const btnAmountHandler = async (e, item) => {
    e.preventDefault();

    const coinBal = (+coinBalance * eval(item))
      .toFixed(keyCoin === "BUSD" ? 14 : 6)
      .toString();
    console.log("item", eval(item), insertAmount, coinBalance, coinBal);
    setInsertAmount(coinBal);
    // if (coinBal) {
    //   console.log("****");
    //   const transactionFees = await calculateTransactionFees(coinBal);
    //   console.log("transactionFees$%$%", transactionFees);
    // } else {
    //   return;
    // }
  };

  const sendCoin = async (e) => {
    e.preventDefault();
    if (validate()) {
      if (insertAmount > coinBalance.toFixed(6) || totalAmount < 0) {
        toast.error(
          `Transferrable amount and transaction fees is larger then your coin balance`,
          {
            autoClose: 2000,
          }
        );
        return;
      }
      const transactionFees = await calculateTransactionFees();
      console.log("TransactionFormFees", transactionFees);
      if (!transactionFees) {
        return;
      }

      // let feeNum;
      // if (transactionFees) {
      //   if (coin_type === "bitcoin") {
      //     feeNum = transactionFees;
      //   } else {
      const feeNum =
        transactionFees.gasLimit * transactionFees.gasPrice * 10 ** -9;
      //   }
      // }
      console.log("feeNumfeeNum", feeNum);

      console.log(
        "tokenBasedCoinBalancetokenBasedCoinBalance",
        feeNum,
        tokenBasedCoinBalance
      );

      if (
        coin_type === "token" &&
        tokenBasedCoinBalance &&
        tokenBasedCoinBalance < feeNum
      ) {
        toast.error(`You don't have much ${coin_name} for transaction fees.`, {
          autoClose: 2000,
        });
      }

      const validTransactionFees =
        transactionFees.gasLimit * transactionFees.gasPrice * 10 ** -9;
      console.log("validTransactionFees", validTransactionFees);
      console.log("all fees", insertAmount, coinBalance);

      // if (+insertAmount + +validTransactionFees >= +coinBalance) {
      //   console.log(
      //     "567567",
      //     +insertAmount + +validTransactionFees,
      //     +coinBalance
      //   );
      //   toast.error(
      //     `Your entered value for the transaction is larger then your balance`,
      //     {
      //       autoClose: 2000,
      //     }
      //   );
      //   return;
      // }
      //TODO validation if enough balance
      const coinClass = (await import(`../../CurrencyHelpers/${keyCoin}`))
        .default;
      const sendTransaction = await new coinClass({
        amount:
          insertAmount === coinBalance.toFixed(6)
            ? insertAmount - validTransactionFees
            : insertAmount,
        to: insertAddress,
        fee: transactionFees,
        balance: coinBalance,
        currentAccount: currentAccount
      });
      console.log("sendTransaction", sendTransaction);

      setInsertAmount("");
      setInsertAddress("");
      setFee(0);
      setTotalAmount(0);
      return sendTransaction.sendCoin({ navigate });
    }
  };

  return (
    <div className="zl_send_recive_content">
      <div className="zl_send_recive_content_row">
        <div className="zl_send_recive_content_column">
          <div className="zl_send_recive_inner_content">
            <h3 className="zl_send_recive_heading">
              {sendBlueIcon}
              Send
            </h3>
            <div className="zl_send_qr_address">
              <input
                placeholder="Insert address"
                className="form-control"
                name="insert_address"
                id="insert_address"
                value={insertAddress}
                onChange={insertAddressHandler}
              />
              <canvas
                height="32"
                width="32"
                className="zl_dark_theme_qrcode"
                style={{ height: "32px", width: "32px" }}
              ></canvas>
              <canvas
                height="32"
                width="32"
                className="zl_light_theme_qrcode"
                style={{ height: "32px", width: "32px" }}
              ></canvas>
            </div>
            {addressErr && <span className="err_text">{addressErr}</span>}
            <div className="zl_send_currency_input_content">
              <input
                type="number"
                className="zl_send_currency_input form-control"
                placeholder="Insert Amount"
                name="insert_amount"
                id="insert_amount"
                value={insertAmount}
                onChange={insertAmountHandler}
              />
              <div className="zl_send_currency_input_btns">
                {/* {["1/4", "Half", "All"].map((item) => {
                  return (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={(e) => btnAmountHandler(e, item)}
                    >
                      {item}
                    </button>
                  );
                })} */}
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={(e) => btnAmountHandler(e, 1 / 4)}
                >
                  1/4
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={(e) => btnAmountHandler(e, 1 / 2)}
                >
                  Half
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={(e) => btnAmountHandler(e, 1)}
                >
                  All
                </button>
              </div>
            </div>
            {amountErr && <span className="err_text">{amountErr}</span>}
            {feeErr && <span className="err_text">{feeErr}</span>}
            <div className="zl_send_currency_text_type">
              <h3 className="zl_send_currency_text">
                ${totalAmount?.toFixed(6)}
              </h3>
              <h3 className="zl_send_currency_type">
                {currency.toUpperCase()}
              </h3>
            </div>
            <div className="zl_send_currency_btn_text">
              <button
                disabled={addressErr || amountErr || feeErr}
                type="button"
                className="zl_send_currency_btn btn btn-primary"
                onClick={(e) => {
                  sendCoin(e);
                }}
              >
                Send
              </button>
              <div className="zl_send_currency_text">
                <p>
                  Network Fee
                  <span>
                    {(+fee)?.toFixed(6)} {coin_name ? coin_name : keyCoin}
                  </span>
                </p>
              </div>
            </div>
          </div>
          {/* <div className="zl_send_recive_inner_content">
            <h3 className="zl_send_recive_heading">
              {sendBlueIcon}
              Send
            </h3>
            <div className="zl_send_qr_address_container">
              <div className="zl_send_qr_address">
                <FormControl
                  placeholder="Insert Amount"
                  name="insert_amount"
                  id="insert_amount"
                  value={insertAmount}
                  onChange={insertAmountHandler}
                />
              </div>
              {amountErr && <span className="err_text">{amountErr}</span>}
            </div>

            <div className="zl_send_qr_address_container">
              <div className="zl_send_qr_address">
                <FormControl
                  placeholder="Insert Address"
                  name="insert_address"
                  id="insert_address"
                  value={insertAddress}
                  onChange={insertAddressHandler}
                />
                <QRCode
                  value={insertAddress}
                  bgColor={"#3D476A"}
                  fgColor={"#CAD3F2"}
                  size={32}
                  className="zl_dark_theme_qrcode"
                />
                <QRCode
                  value={insertAddress}
                  bgColor={"#EFF0F2"}
                  fgColor={"#3D476A"}
                  size={32}
                  className="zl_light_theme_qrcode"
                />
              </div>
              {addressErr && <span className="err_text">{addressErr}</span>}
            </div>

            <div className="zl_send_currency_btn_text">
              <Button
                className="zl_send_currency_btn"
                onClick={(e) => {
                  sendCoin(e);
                }}
              >
                Send
              </Button>
            </div>
          </div> */}
        </div>
        <div className="zl_send_recive_content_column">
          <div className="zl_send_recive_inner_content">
            <h3 className="zl_send_recive_heading zl_recive_heading">
              {receiveBlueIcon}
              Receive
            </h3>
            <div className="zl_recive_address_content">
              <p className="zl_recive_address_heading">Address</p>
              <div className="zl_recive_copy_address_content">
                <Button
                  onClick={() =>
                    navigator.clipboard.writeText(transactionAddress)
                  }
                >
                  {copyLargeIcon}
                </Button>
                <p>{transactionAddress}</p>
              </div>
              {transactionAddress && (
                <div className="zl_recive_address_qr_code">
                  <QRCode
                    value={transactionAddress}
                    bgColor={"transparent"}
                    fgColor={"#CAD3F2"}
                    size={166}
                    className="zl_dark_theme_qrcode"
                  />
                  <QRCode
                    value={transactionAddress}
                    bgColor={"transparent"}
                    fgColor={"#3D476A"}
                    size={166}
                    className="zl_light_theme_qrcode"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;
