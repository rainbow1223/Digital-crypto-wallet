import BEP20Based from "./BEP20Based";

class BUSD extends BEP20Based {
  constructor(props) {
    super({
      ...props,
      key: "BUSD",
      keyCoin: "BSC",
      digits: 18,
      contractAddress: "0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee",
    });
  }
}

export default BUSD;
