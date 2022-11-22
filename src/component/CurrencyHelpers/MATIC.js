import ETHBased from "./ETHBased";

class MATIC extends ETHBased {
  constructor(props) {
    super({ ...props, key: "polygon", keyCoin: "MATIC", coinFees: "40000" });

    // this.TransactionFees = this.TransactionFees.bind(this);
  }
}

export default MATIC;
