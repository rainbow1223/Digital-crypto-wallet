// import AxiosTatum, { authHeadersTatum } from "../../helpers/Axios/axiosTatum";
// import { toast } from "react-toastify";
// import { routes } from "../../constants";
import ETHBased from "./ETHBased";

class ETH extends ETHBased {
  constructor(props) {
    super({
      ...props,
      key: "ethereum",
      keyCoin: "ETH",
    });

    this.TransactionFees = this.TransactionFees.bind(this);
    // this.getFees = this.getFees.bind(this);
  }

  TransactionFees = async () => {
    const fees = await this.ethBasedTransactionFees();
    console.log("fees", fees);
    // this.coinFees = {
    //   gasLimit: "22680" || fees?.gasLimit,
    //   gasPrice: (fees?.estimations.standard * 10 ** -9).toFixed(0),
    // };
    return {
      gasLimit: Math.max(+"22680", +fees?.gasLimit).toString(),
      gasPrice: (fees?.estimations.standard * 10 ** -9).toFixed(0),
    };
  };

  //   getFees = () => {
  //     return this.coinFees;
  //   };

  //   sendCoin = async (data) => {
  //     try {
  //       const response = await AxiosTatum.post(
  //         `/ethereum/transaction`,
  //         data.data,
  //         authHeadersTatum()
  //       );
  //       if (response.status === 200) {
  //         toast.success("ETH Transaction Completed Successfully !", {
  //           autoClose: 2000,
  //         });
  //         data.navigate(routes.walletsPage);
  //       }
  //       return response.data;
  //     } catch (error) {
  //       if (error.response.status === 400 || 403 || 500) {
  //         toast.error("ETH Transaction Failed !", {
  //           autoClose: 2000,
  //         });
  //       }
  //       console.log("error", error.response);
  //       return error.response;
  //     }
  //   };
}

export default ETH;
