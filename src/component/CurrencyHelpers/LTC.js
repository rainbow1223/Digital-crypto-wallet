import BTCBased from "./BTCBased";

class LTC extends BTCBased {
  constructor(props) {
    super({
      ...props,
      key: "litecoin",
      keyCoin: "LTC",
    });

    // this.TransactionFees = this.TransactionFees.bind(this);
  }

  // TransactionFees = async () => {
  //   const fees = await this.btcBasedTransactionFees();
  //   console.log("fees", fees);

  //   return fees?.medium;
  // };
}

export default LTC;
