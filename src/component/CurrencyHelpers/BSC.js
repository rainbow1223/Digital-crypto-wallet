import ETHBased from "./ETHBased";

class BSC extends ETHBased {
  constructor(props) {
    super({ ...props, key: "bsc", keyCoin: "BSC", coinFees: "22680" });

    // this.TransactionFees = this.TransactionFees.bind(this);
  }

  // TransactionFees = async (data) => {
  //   const fees = await this.ethBasedTransactionFees(data);
  //   console.log("fees", fees);
  //   return {
  //     gasLimit: "22680" || fees?.gasLimit,
  //     gasPrice: (fees?.gasPrice * 10 ** -9).toFixed(0),
  //   };
  // };
}

export default BSC;
