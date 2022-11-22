import BTCBased from "./BTCBased";

class BTC extends BTCBased {
  constructor(props) {
    super({
      ...props,
      key: "bitcoin",
      keyCoin: "BTC",
    });

    // this.TransactionFees = this.TransactionFees.bind(this);
  }

  // TransactionFees = async () => { //TODO move this function to top class
  //   const fees = await this.btcBasedTransactionFees();
  //   console.log("fees", fees);

  //   return fees?.medium;
  // };
}

export default BTC;
