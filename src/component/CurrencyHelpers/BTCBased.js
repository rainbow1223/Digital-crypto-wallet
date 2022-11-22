import AxiosTatum, { authHeadersTatum } from "../../helpers/Axios/axiosTatum";
import { toast } from "react-toastify";
import { routes } from "../../constants";

class BTCBased {
  constructor(props) {
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
    this.privateKey =
      localStorage.getItem("user_crypto_currency_data") &&
      JSON.parse(localStorage.getItem("user_crypto_currency_data"))[this.currentAccount][
        this.keyCoin
      ]?.privateKey;
    this.balance = props.balance;
    this.fee = props.fee;
    this.feesData = {
      chain: this.keyCoin,
      type: "TRANSFER",
      fromAddress: [this.transactionAddress],
      to: [
        {
          address: this.toAddress,
          value: +this.amount,
        },
        {
          address: this.transactionAddress,
          value: +(+this.balance - +this.amount).toFixed(6),
        },
      ],
    };
    console.log("feesDataLog", +this.balance, +this.amount);
    this.sendCoinData = {
      fromAddress: [
        {
          address: this.transactionAddress,
          privateKey: this.privateKey,
        },
      ],
      to: [
        {
          address: this.toAddress,
          value: +this.amount,
        },
        {
          address: this.transactionAddress,
          value: +(+this.balance - this.fee - +this.amount).toFixed(6),
        },
      ],
    };
  }

  TransactionFees = async () => {
    try {
      const response = await AxiosTatum.post(
        `/blockchain/estimate`,
        this.feesData,
        authHeadersTatum()
      );
      console.log("responseBtcBasedTransactionFees", response.data);
      return response.data?.medium;
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
      console.log("response", response.data);
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

export default BTCBased;
