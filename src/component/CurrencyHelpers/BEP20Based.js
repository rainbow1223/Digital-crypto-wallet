import AxiosTatum, { authHeadersTatum } from "../../helpers/Axios/axiosTatum";
import { toast } from "react-toastify";
import ERC20Based from "./ERC20Based";

class BEP20Based extends ERC20Based {
  constructor(props) {
    super({
      ...props,
    });
    this.TransactionFees = this.TransactionFees.bind(this);
    this.key = props.key;
    this.keyCoin = props.keyCoin;
    this.toAddress = props.to;
    this.contractAddress = props.contractAddress;
    this.amount = props.amount;
    this.currentAccount = props.currentAccount;
    this.transactionAddress =
      localStorage.getItem("user_crypto_currency_data") &&
      JSON.parse(localStorage.getItem("user_crypto_currency_data"))[this.currentAccount][this.key]
        ?.address;

    this.feesData = {
      chain: "BSC",
      type: "TRANSFER_ERC20",
      sender: this.transactionAddress,
      recipient: this.toAddress,
      contractAddress: this.contractAddress,
      amount: this.amount,
    };
    // console.log("this.feesData", this.feesData);
  }

  TransactionFees = async () => {
    try {
      const response = await AxiosTatum.post(
        `/blockchain/estimate`,
        this.feesData,
        authHeadersTatum()
      );
      console.log("responseTransactionFeesBEP", response.data, response);
      return {
        gasLimit: Math.max(+21000, +response.data?.gasLimit).toString(),
        gasPrice: (response.data?.gasPrice).toFixed(0),
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
}

export default BEP20Based;
