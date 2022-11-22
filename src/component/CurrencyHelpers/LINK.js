import MATICBasedERC20 from "./MATICBasedERC20";

class LINK extends MATICBasedERC20 {
  constructor(props) {
    super({
      ...props,
      key: "LINK",
      keyCoin: "MATIC",
      digits: 18,
      contractAddress: "0x326c977e6efc84e512bb9c30f76e30c160ed06fb",
    });
  }
}

export default LINK;
