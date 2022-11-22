// const bip39 = require("bip39");
// const Web3 = require("web3");
// const async = require("async");
// const Tx = require("ethereumjs-tx").Transaction;

// const zluckEtherUtils = require("./zluck-ether-utils");

// //https://www.npmjs.com/package/ethereum-hdwallet

// const ether = async (props, cb) => {
//   var mnemonic;
//   console.log(props);
//   if (props === undefined) {
//     mnemonic = bip39.generateMnemonic();
//   } else {
//     mnemonic = props;
//   }
//   //var mnemonic = "peasant vast exhaust same such uniform amazing sight admit route engine neck"; address = "0xf7cbadbebd70758caf6117028c9f30b2a731cdb8"
//   console.log("mnemonic", mnemonic);

//   var provider =
//     "https://rinkeby.infura.io/v3/588a25a6c66a4297beb1dcaef2da8599";
//   var account = new zluckEtherUtils(mnemonic, provider);

//   var address = account.getAddress(0);
//   console.log("address", address);
//   // 0xd2045b2fc811d2dc803bcb1f75cb3e3038398788

//   var privateKey = account.getPrivateKey(0);
//   console.log("privateKey", privateKey);

//   var web3 = new Web3(
//     new Web3.providers.HttpProvider(
//       "https://rinkeby.infura.io/v3/588a25a6c66a4297beb1dcaef2da8599"
//     )
//   );
//   var BN = web3.utils.BN;
//   //web3 get balance of address
//   var balance,
//     gasPriceWei,
//     rawTransaction,
//     nonce,
//     tx,
//     signedTx,
//     txHash,
//     err,
//     blockNumber,
//     blockTransaction;
//   var gasLimit = 300000;
//   var toAddress = "0xeb65939f2731e426810f199b3ef285c99eefc967";

//   async.series(
//     [
//       function (callback) {
//         web3.eth.getBalance(address, function (err, result) {
//           if (err) {
//             console.log(err);
//             callback(err);
//           } else {
//             balance = result;
//             console.log(
//               web3.utils.fromWei(result.toString(10), "ether"),
//               "ETH"
//             );
//             callback(null);
//           }
//         });
//       },
//       function (callback) {
//         //get ether gas price
//         web3.eth.getGasPrice(function (err, result) {
//           if (err) {
//             console.log(err);
//             callback(err);
//           } else {
//             gasPriceWei = result;
//             console.log("gasPriceWei:", gasPriceWei);
//             callback(null);
//           }
//         });
//       },
//       function (callback) {
//         //get nonce for address
//         web3.eth.getTransactionCount(address, function (err, result) {
//           if (err) {
//             console.log(err);
//             callback(err);
//           } else {
//             nonce = result;
//             console.log("nonce:", nonce);
//             callback(null);
//           }
//         });
//       },

//       function (callback) {
//         var transferAmount = web3.utils.toWei("0.0000000003", "ether");
//         //   if (new BN(balance).lt(new BN(transferAmount))) {
//         //     return callback("You have insufficient balance in your account");
//         //   }

//         //   //verify balance
//         //   if (
//         //     new BN(balance).lt(
//         //       new BN(new BN(gasPriceWei * gasLimit).add(new BN(transferAmount)))
//         //     )
//         //   ) {
//         //     console.log(new BN(balance).toString(), "balance");
//         //     console.log(
//         //       new BN(
//         //         new BN(gasPriceWei * gasLimit).add(new BN(transferAmount))
//         //       ).toString(),
//         //       "transferAmount"
//         //     );
//         //     console.log(
//         //       new BN(balance).lt(
//         //         new BN(new BN(gasPriceWei * gasLimit).add(new BN(transferAmount)))
//         //       ),
//         //       "result"
//         //     );
//         //     return callback(
//         //       "You have insufficient balance for fee in your account"
//         //     );
//         //   }

//         // prepar raw transaction
//         rawTransaction = {
//           from: address,
//           nonce: web3.utils.toHex(nonce),
//           to: toAddress,
//           value: web3.utils.toHex(transferAmount),
//           gasPrice: web3.utils.toHex(gasPriceWei),
//           gasLimit: web3.utils.toHex(gasLimit),
//           data: "0x",
//           chainId: 4, //mainnet 1, rinkeyby 4, ropsten 3 - https://besu.hyperledger.org/en/stable/Concepts/NetworkID-And-ChainID/
//         };

//         callback(null);
//       },

//       function (callback) {
//         //sign raw transaction
//         tx = new Tx(rawTransaction, { chain: "rinkeby" });
//         tx.sign(account.getPrivateKeyUint8(0));
//         signedTx = tx.serialize();
//         console.log("signedTx", signedTx);
//         callback(null);
//       },
//     ],
//     function (er, results) {
//       if (er) {
//         err = er;
//         console.log(err);
//       } else {
//         err = "";
//         //console.log("balance:", balance);
//         //console.log("gasPriceWei:", gasPriceWei);
//       }
//       console.log("balance", balance);
//       console.log("tx", tx);
//       console.log("txHash", txHash);
//       let expectedResponse = {
//         mnemonic,
//         address,
//       };
//       let ethereum = {
//         balance, // done
//         gasPriceWei, // in history
//         rawTransaction,
//         nonce, // in history
//         tx,
//         signedTx,
//         txHash,
//         privateKey,
//         err,
//       };
//       localStorage.setItem("user", JSON.stringify(expectedResponse));
//       localStorage.setItem("ethereum", JSON.stringify(ethereum));
//       cb(null, expectedResponse);
//     }
//   );
// };

// export default ether;
