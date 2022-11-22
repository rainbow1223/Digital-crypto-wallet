import { routes } from "../../constants";
import AxiosTatum, { authHeadersTatum } from "../../helpers/Axios/axiosTatum";
import { toast } from "react-toastify";

class ERC20Based {
  constructor(props) {
    this.TransactionFees = this.TransactionFees.bind(this);
    this.key = props.key;
    this.keyCoin = props.keyCoin;
    this.chain = props.chain;
    this.amount = props.amount;
    this.contractAddress = props.contractAddress;
    this.toAddress = props.to;
    this.digits = props.digits;
    this.currentAccount = props.currentAccount;
    this.transactionAddress =
      localStorage.getItem("user_crypto_currency_data") &&
      JSON.parse(localStorage.getItem("user_crypto_currency_data"))[this.currentAccount][this.key]
        ?.address;
    this.privateKey =
      localStorage.getItem("user_crypto_currency_data") &&
      JSON.parse(localStorage.getItem("user_crypto_currency_data"))[this.currentAccount][this.key]
        ?.privateKey;
    this.fee = props.fee;
    this.feesData = {
      from: this.transactionAddress,
      to: this.toAddress,
      contractAddress: this.contractAddress,
      amount: this.amount,
    };
    this.sendCoinData = {
      chain: this.keyCoin,
      to: this.toAddress,
      amount: this.amount,
      fee: this.fee,
      contractAddress: this.contractAddress,
      digits: this.digits,
      fromPrivateKey: this.privateKey,
    };
    // console.log("this.sendCoinData", this.sendCoinData);
  }

  TransactionFees = async () => {
    try {
      const response = await AxiosTatum.post(
        `/ethereum/gas`,
        this.feesData,
        authHeadersTatum(this.chain)
      );
      console.log("responseTransactionFees", response.data);
      return {
        gasLimit: Math.max(+30000, +response.data?.gasLimit).toString(),
        gasPrice: (response.data?.estimations.standard * 10 ** -9).toFixed(0),
      };
    } catch (error) {
      console.log("error", error);
      if (error.response.status === 400 || 403 || 500) {
        toast.error(`Something went wrong for calculate ${this.key} fees!`, {
          autoClose: 2000,
        });
      }
      return error.response;
    }
  };

  sendCoin = async (data) => {
    try {
      const response = await AxiosTatum.post(
        `/blockchain/token/transaction`,
        this.sendCoinData,
        authHeadersTatum(this.chain)
      );
      if (response.status === 200) {
        toast.success(`${this.key} Transaction Completed Successfully !`, {
          autoClose: 2000,
        });
        data.navigate(routes.walletsPage);
      }
      return response.data;
    } catch (error) {
      if (error.response.status === 400 || 403 || 500) {
        toast.error(`${this.key} Transaction Failed !`, {
          autoClose: 2000,
        });
      }
      console.log("error", error.response);
      return error.response;
    }
  };
}

export default ERC20Based;
