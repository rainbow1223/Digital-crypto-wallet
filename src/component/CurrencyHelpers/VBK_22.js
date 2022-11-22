import ERC20Based from "./ERC20Based";

class VBK_22 extends ERC20Based {
  constructor(props) {
    super({
      ...props,
      key: "VBK_22",
      keyCoin: "ETH",
      chain: "rinkeby",
      digits: 6,
      contractAddress: "0x912d2a3d67d001da33f3b5f0d24c7f37b3954ab4",
    });
  }
}

export default VBK_22;
