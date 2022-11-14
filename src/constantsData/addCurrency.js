export const addCurrency = [
  {
    image: "assets/image/Bitcoin.svg", // Image of crypto-coin (Add image in public/assets/img folder)
    currency: "BTC", // Value used for generateWallet (For this value refer tatum doc)
    display_currency: "BTC", // This Value is used to display crypto currency unit
    coingecko_coin_name: "bitcoin", // This Value is used to fetch data dynamically from coingecko API response (For this value refer coingecko doc)
    moralis_api_chain: "", // Value used as a chain id like rinkeby, ropsten, mumbai, erc20, bep20, bsc testnet for getting transaction for ethereum based coin
    moralis_coin_name: "", // Value is used to fetch data dynamically from moralis API transaction response (For this value refer moralis doc. for ex. for getting ethereum based transaction from moralis)
    tatum_coin_name: "bitcoin", // Value is used to fetch data dynamically from tatum API response (For this value refer tatum doc)
    is_erc20: false, // Value is used to specify whether the currency is ero20 Token or not (true for erc20, bep20 else false)
    default_enabled: true, // To specify whether currency is enabled or disabled by default
    transaction_link: "https://www.blockchain.com/btc/tx/", // Value of Base URL to visit transaction details page based on hash for particular Crypto coin
    coin_type: "bitcoin", // Value is used to specify type of crypto currency (For ex. "bitcoin" for Bitcoin based Crypto Currency, "ethereum" for Ethereum based Crypto Currency and "token" for Tokens)
  },
  {
    image: "assets/image/Litecoin.svg",
    currency: "LTC",
    display_currency: "LTC",
    coingecko_coin_name: "litecoin",
    moralis_api_chain: "",
    moralis_coin_name: "",
    tatum_coin_name: "litecoin",
    is_erc20: false,
    default_enabled: false,
    transaction_link: "https://www.blockchain.com/btc/tx/",
    coin_type: "bitcoin",
  },
  {
    image: "assets/image/ETH.svg",
    currency: "ETH",
    display_currency: "ETH",
    coingecko_coin_name: "ethereum",
    moralis_api_chain: "mainnet",
    moralis_coin_name: "ethereum",
    tatum_coin_name: "ethereum",
    is_erc20: false,
    default_enabled: true,
    transaction_link: "https://etherscan.io/tx/",
    coin_type: "ethereum",
  },
  {
    image: "assets/image/bnb.svg",
    // name: "bsc",
    currency: "BSC",
    display_currency: "BNB",
    coingecko_coin_name: "binancecoin",
    moralis_api_chain: "bsc testnet",
    moralis_coin_name: "binancecoin",
    tatum_coin_name: "bsc",
    is_erc20: false,
    default_enabled: false,
    transaction_link: "https://bscscan.com/tx/",
    coin_type: "ethereum",
  },
  {
    image: "assets/image/polygon.svg",
    currency: "MATIC",
    display_currency: "MATIC",
    coingecko_coin_name: "matic-network",
    moralis_api_chain: "mumbai",
    moralis_coin_name: "matic-network",
    tatum_coin_name: "polygon",
    is_erc20: false,
    default_enabled: false,
    transaction_link: "https://mumbai.polygonscan.com/tx/",
    coin_type: "ethereum",
  },
  {
    image: "assets/image/tether.svg",
    currency: "TUSDT",
    display_currency: "TUSDT",
    coingecko_coin_name: "tether",
    moralis_api_chain: "erc20",
    moralis_coin_name: "tether",
    tatum_coin_name: "ethereum", // For ex. for erc20 token we used "ethereum", for bep20 token we used "bsc" and for matic based token we used "polygon"
    is_erc20: true,
    contract_address: "0xd92e713d051c37ebb2561803a3b5fbabc4962431", // Value is used to specify contract address of specific token
    digits: 6, // Value used to specify supported decimal points
    default_enabled: false,
    testnet_type: "rinkeby", // Value used to specify testnet network (For ex. rinkeby or ropsten)
    transaction_link: "https://rinkeby.etherscan.io/tx/",
    coin_type: "token",
    coin_name: "ETH", // Value used to get balance of main crypto currency (For ex. for erc20 token we used "ETH", for bep20 token we used "BSC" and for matic based token we used "MATIC")
    chain: "rinkeby", // This Value is used to pass chain id based on network to get transactions(For ex. rinkeby or ropsten for ethereum, bsc testnet for binance, mumbai for matic)
  },
  {
    image: "assets/image/tezos.svg",
    currency: "VBK_22",
    display_currency: "VBK_22",
    coingecko_coin_name: "erc20",
    moralis_api_chain: "erc20",
    moralis_coin_name: "",
    tatum_coin_name: "ethereum",
    is_erc20: true,
    contract_address: "0x912d2a3d67d001da33f3b5f0d24c7f37b3954ab4",
    digits: 8,
    default_enabled: false,
    testnet_type: "rinkeby",
    transaction_link: "https://rinkeby.etherscan.io/tx/",
    coin_type: "token",
    coin_name: "ETH",
    chain: "rinkeby",
  },
  {
    image: "assets/image/dash.svg",
    currency: "BUSD",
    display_currency: "BUSD",
    coingecko_coin_name: "binance-usd",
    moralis_api_chain: "bep20",
    moralis_coin_name: "",
    tatum_coin_name: "bsc",
    is_erc20: true,
    contract_address: "0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee",
    digits: 18,
    default_enabled: false,
    transaction_link: "https://bscscan.com/tx/",
    coin_type: "token",
    coin_name: "BSC",
    chain: "bsc testnet",
  },
  {
    image: "assets/image/zcash.svg",
    currency: "LINK",
    display_currency: "LINK",
    coingecko_coin_name: "chainlink",
    moralis_api_chain: "",
    moralis_coin_name: "",
    tatum_coin_name: "polygon",
    is_erc20: true,
    contract_address: "0x326c977e6efc84e512bb9c30f76e30c160ed06fb",
    digits: 18,
    default_enabled: false,
    transaction_link: "https://mumbai.polygonscan.com/tx/",
    coin_type: "token",
    coin_name: "MATIC",
    chain: "mumbai",
  },
];
