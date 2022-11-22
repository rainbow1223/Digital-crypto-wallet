import ERC20Based from "./ERC20Based";

class TUSDT extends ERC20Based {
  constructor(props) {
    super({
      ...props,
      key: "TUSDT",
      keyCoin: "ETH",
      chain: "rinkeby",
      digits: 6,
      contractAddress: "0xd92e713d051c37ebb2561803a3b5fbabc4962431",
    });

    // this.TransactionFees = this.TransactionFees.bind(this);
  }
  //TODO folder name - remove space
  // TransactionFees = async () => { //TODO move to top class
  //   const fees = await this.erc20BasedTransactionFees();
  //   console.log("fees", fees);

  //   return {
  //     gasLimit: "22680" || fees?.gasLimit,
  //     gasPrice: (fees?.estimations.standard * 10 ** -9).toFixed(0),
  //   };
  // };
}

export default TUSDT;
