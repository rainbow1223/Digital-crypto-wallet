import { routes } from "../../constants";
import AxiosTatum, { authHeadersTatum } from "../../helpers/Axios/axiosTatum";
import { toast } from "react-toastify";

class ETHBased {
  constructor(props) {
    this.ethBasedTransactionFees = this.ethBasedTransactionFees.bind(this);
    this.TransactionFees = this.TransactionFees.bind(this);
    this.key = props.key;
    this.keyCoin = props.keyCoin;
    this.amount = props.amount;
    this.toAddress = props.to;
    this.currentAccount = props.currentAccount;
    this.transactionAddress =
      localStorage.getItem("user_crypto_currency_data") &&
      JSON.parse(localStorage.getItem("user_crypto_currency_data"))[this.currentAccount][
        this.keyCoin
      ]?.address;
    this.data = `Transaction from ${this.transactionAddress} to ${this.toAddress}`;
    this.privateKey =
      localStorage.getItem("user_crypto_currency_data") &&
      JSON.parse(localStorage.getItem("user_crypto_currency_data"))[this.currentAccount][
        this.keyCoin
      ]?.privateKey;
    this.coinFees = props.coinFees;
    this.fee = props.fee;
    this.feesData = {
      from: this.transactionAddress,
      to: this.toAddress,
      amount: this.amount,
    };
    this.sendCoinData = {
      data: this.data,
      to: this.toAddress,
      currency: this.keyCoin,
      fee: this.fee,
      amount: this.amount,
      fromPrivateKey: this.privateKey,
    };
    // console.log("this.sendCoinData", this.sendCoinData);
  }

  TransactionFees = async (data) => {
    try {
      const response = await AxiosTatum.post(
        `/${this.key}/gas`,
        this.feesData,
        authHeadersTatum()
      );
      console.log("responseTransactionFees", response.data);
      return {
        gasLimit: Math.max(+this.coinFees, +response.data?.gasLimit).toString(),
        gasPrice: (response.data?.gasPrice * 10 ** -9).toFixed(0),
      };
    } catch (error) {
      console.log("error", error);
      if (error.response.status === 400 || 403 || 500) {
        toast.error(
          `Something went wrong for calculate ${this.keyCoin} fees!`,
          {
            autoClose: 2000,
          }
        );
      }
      return error.response;
    }
  };

  ethBasedTransactionFees = async () => {
    try {
      const response = await AxiosTatum.post(
        `/${this.key}/gas`,
        this.feesData,
        authHeadersTatum()
      );
      console.log("responseTransactionFees", response.data);
      return response.data;
    } catch (error) {
      console.log("error", error);
      if (error.response.status === 400 || 403 || 500) {
        toast.error(
          `Something went wrong for calculate ${this.keyCoin} fees!`,
          {
            autoClose: 2000,
          }
        );
      }
      return error.response;
    }
  };

  sendCoin = async (data) => {
    try {
      const response = await AxiosTatum.post(
        `/${this.key}/transaction`,
        this.sendCoinData,
        authHeadersTatum()
      );
      if (response.status === 200) {
        toast.success(`${this.keyCoin} Transaction Completed Successfully !`, {
          autoClose: 2000,
        });
        data.navigate(routes.walletsPage);
      }
      return response.data;
    } catch (error) {
      if (error.response.status === 400 || 403 || 500) {
        toast.error(`${this.keyCoin} Transaction Failed !`, {
          autoClose: 2000,
        });
      }
      console.log("error", error.response);
      return error.response;
    }
  };
}

export default ETHBased;
