import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AxiosCoingecko from "../../helpers/Axios/axiosCoingecko";
import AxiosTatum, { authHeadersTatum } from "../../helpers/Axios/axiosTatum";

export const deleteAccounts = createAsyncThunk(
  'deleteAccounts',
  async (data, thunkAPI) => {
    let mnemonicsArray = JSON.parse(localStorage.getItem('mnemonics')).filter((mnemonics, index) => !data.isAccountSelected[index]);;
    let user_crypto_currency_data = JSON.parse(localStorage.getItem('user_crypto_currency_data')).filter((value, index) => !data.isAccountSelected[index]);

    localStorage.setItem('mnemonics', JSON.stringify(mnemonicsArray));
    localStorage.setItem('user_crypto_currency_data', JSON.stringify(user_crypto_currency_data));

    return data.isAccountSelected;
  }
);

export const addBalanceAll = createAsyncThunk(
  'addBalanceAll',
  async (data, thunkAPI) => {
    const cryptoCoins = await JSON.parse(localStorage.getItem("checkCrypto"));
    const userCurrency = data.params;
    let balanceAll = [];
    // console.log('userCurrency;', userCurrency);
    for (let account of userCurrency) {
      let balanceOfAccount = {};
      let ecr20BalanceOfAccount = {};
      for (let cryptoCoin of cryptoCoins) {
        // console.log('cryptoCoin:', cryptoCoin)
        if (!cryptoCoin.is_erc20) {
          if (cryptoCoin.coin_type === 'bitcoin') {
            try {
              // console.log('addressssss', `/${cryptoCoin.tatum_coin_name}/address/balance/${account[cryptoCoin?.currency]?.address}`)
              const response = await AxiosTatum.get(
                `/${cryptoCoin.tatum_coin_name}/address/balance/${account[cryptoCoin?.currency]?.address}`,
                authHeadersTatum()
              );
              balanceOfAccount[cryptoCoin?.tatum_coin_name] = (response.data.incoming - response.data.outgoing).toString();
            } catch (error) {
              console.log(error);
            }

          } else {
            try {
              const response = await AxiosTatum.get(
                `/${cryptoCoin.tatum_coin_name}/account/balance/${account[cryptoCoin?.currency]?.address}`,
                authHeadersTatum()
              );
              balanceOfAccount[cryptoCoin.tatum_coin_name] = response.data.balance;
            } catch (error) {
              console.log(error);
            }
          }
        } else {
          try {
            const response = await AxiosTatum.get(
              `/blockchain/token/balance/${cryptoCoin?.coin_name}/${cryptoCoin?.contract_address}/${account[cryptoCoin?.currency]?.address}`,
              authHeadersTatum(cryptoCoin?.testnet_type ? cryptoCoin?.testnet_type : "")
            );
            ecr20BalanceOfAccount[cryptoCoin?.currency] = (response.data.balance / 10 ** data.digits).toString();
          } catch (error) {
            console.log(error.response);
          }
        }

      }
      balanceAll = [...balanceAll, { balance: balanceOfAccount, erc20Balance: ecr20BalanceOfAccount }];
    }
    return balanceAll;
  }
);

export const getBalanceAll = createAsyncThunk(
  'getBalanceAll',
  async (data, thunkAPI) => {
    // console.log('getbalanceall')
    const cryptoCoins = JSON.parse(localStorage.getItem("checkCrypto"));
    // console.log("cryptoCoins", cryptoCoins);
    const userCurrency = JSON.parse(
      localStorage.getItem("user_crypto_currency_data")
    );
    // console.log("userCurrencyAll", userCurrency, cryptoCoins);
    let balanceAll = [];
    // console.log('userCurrency;', userCurrency);
    for (let account of userCurrency) {
      let balanceOfAccount = {};
      let ecr20BalanceOfAccount = {};
      for (let cryptoCoin of cryptoCoins) {
        // console.log('cryptoCoin:', cryptoCoin)
        if (!cryptoCoin.is_erc20) {
          if (cryptoCoin.coin_type === 'bitcoin') {
            try {
              // console.log('addressssss', `/${cryptoCoin.tatum_coin_name}/address/balance/${account[cryptoCoin?.currency]?.address}`)
              const response = await AxiosTatum.get(
                `/${cryptoCoin.tatum_coin_name}/address/balance/${account[cryptoCoin?.currency]?.address}`,
                authHeadersTatum()
              );
              balanceOfAccount[cryptoCoin?.tatum_coin_name] = (response.data.incoming - response.data.outgoing).toString();
            } catch (error) {
              console.log(error);
            }

          } else {
            try {
              const response = await AxiosTatum.get(
                `/${cryptoCoin.tatum_coin_name}/account/balance/${account[cryptoCoin?.currency]?.address}`,
                authHeadersTatum()
              );
              balanceOfAccount[cryptoCoin.tatum_coin_name] = response.data.balance;
            } catch (error) {
              console.log(error);
            }
          }
        } else {
          try {
            const response = await AxiosTatum.get(
              `/blockchain/token/balance/${cryptoCoin?.coin_name}/${cryptoCoin?.contract_address}/${account[cryptoCoin?.currency]?.address}`,
              authHeadersTatum(cryptoCoin?.testnet_type ? cryptoCoin?.testnet_type : "")
            );
            ecr20BalanceOfAccount[cryptoCoin?.currency] = (response.data.balance / 10 ** data.digits).toString();
          } catch (error) {
            console.log(error.response);
          }
        }

      }
      balanceAll = [...balanceAll, { balance: balanceOfAccount, erc20Balance: ecr20BalanceOfAccount }];
    }
    return balanceAll;
  }
);

export const clearBalanceAll = createAsyncThunk(
  'clearBalanceAll',
  async (data, thunkAPI) => {
    return;
  }
)

export const getBalance = createAsyncThunk(
  "getBalance",
  async (data, thunkAPI) => {
    try {
      if (data.coin_type === "bitcoin") {
        const response = await AxiosTatum.get(
          `/${data.coin}/address/balance/${data.address}`,
          authHeadersTatum()
        );
        // console.log('coin', data.coin)
        console.log('balanceRes', response.data, `/${data.coin}/address/balance/${data.address}`);
        return {
          [data.coin]: (
            response.data.incoming - response.data.outgoing
          ).toString(),
        };
      }
      const response = await AxiosTatum.get(
        `/${data.coin}/account/balance/${data.address}`,
        authHeadersTatum()
      );
      console.log("balanceResponse", [data.coin], response.data.balance);
      return {
        [data.coin]: response.data.balance,
      };
    } catch (error) {
      console.log("error", error);
    }
  }
);

export const coinBasedTokenBalance = createAsyncThunk(
  "coinBasedTokenBalance",
  async (data, thunkAPI) => {
    try {
      const response = await AxiosTatum.get(
        `/${data.coin}/account/balance/${data.address}`,
        authHeadersTatum()
      );
      console.log(
        "coinBasedTokenBalanceResponse",
        [data.coin],
        response.data.balance
      );
      return {
        [data.coin]: response.data.balance,
      };
    } catch (error) {
      console.log("error", error);
    }
  }
);

export const getErc20Balance = createAsyncThunk(
  "getErc20Balance",
  async (data, thunkAPI) => {
    try {
      const response = await AxiosTatum.get(
        `/blockchain/token/balance/${data.coin}/${data.contract_address}/${data.address}`,
        authHeadersTatum(data.testnet_type ? data.testnet_type : "")
      );

      return {
        [data.token]: (response.data.balance / 10 ** data.digits).toString(),
      };
    } catch (error) {
      console.log("error", error.response);
    }
  }
);

export const clearBalance = createAsyncThunk(
  "clearBalance",
  async (data, thunkAPI) => {
    return;
  }
);



export const currencyPriceDetail = createAsyncThunk(
  "currencyPriceDetail",
  async (data, thunkAPI) => {
    try {
      const response = await AxiosCoingecko.get(
        `/simple/price?ids=${data.coins}&vs_currencies=${data.currency}`
      );
      console.log("currencyprice", response.data);
      return response.data;
    } catch (error) {
      console.log("error", error);
    }
  }
);

const balanceSlice = createSlice({
  name: "balance",
  initialState: {
    balance: [],
    erc20Balance: [],
    tokenBalance: [],
    currencyPrice: null,
    error: null,
    loader: false,
    balanceAll: [],
    balanceAllLoader: false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(deleteAccounts.pending, (state) => {
      state.deleteAccountsLoader = true;
    });
    builder.addCase(deleteAccounts.fulfilled, (state, action) => {
      state.deleteAccountsLoader = false;
      state.balanceAll = state.balanceAll.filter((balance, index) => !action.payload[index]);
    });
    builder.addCase(deleteAccounts.rejected, (state, action) => {
      state.deleteAccountsLoader = true;
      state.error = action.payload;
    });
    builder.addCase(addBalanceAll.pending, (state) => {
      state.balanceAllLoader = true;
    });
    builder.addCase(addBalanceAll.fulfilled, (state, action) => {
      state.balanceAllLoader = false;
      const cryptoCoins =
        localStorage.getItem("checkCrypto") &&
        JSON.parse(localStorage.getItem("checkCrypto"));

      const currency = localStorage.getItem("currency").toLowerCase();

      // let tempBalanceAll = action.payload;

      console.log('balanceAll', action.payload);
      let tempBalanceAll = [];
      for (let account of action.payload) {
        const { balance, erc20Balance } = account;
        let tempBalance = [];
        let tempErc20Balance = [];
        for (let i = 0; i < cryptoCoins.length; i++) {
          let tempBalancePerCoin;
          if (!cryptoCoins[i].is_erc20 && currency) {
            const bal = balance && balance[cryptoCoins[i].tatum_coin_name];

            if (bal) {
              tempBalancePerCoin = {
                balance: +bal,
                name: cryptoCoins[i].display_currency,
                fiat_val:
                  state.currencyPrice[cryptoCoins[i]?.coingecko_coin_name][currency],
                fiat_balance:
                  bal *
                  +state.currencyPrice[cryptoCoins[i]?.coingecko_coin_name][currency],
              }
              tempBalance = [...tempBalance, tempBalancePerCoin];
            }
          }

          if (cryptoCoins[i].is_erc20 && currency) {
            const balance = erc20Balance && erc20Balance[cryptoCoins[i].currency];
            // const balance = bal?.balance / 10 ** +bal?.decimals;
            if (balance) {
              tempBalancePerCoin = {
                balance: +balance,
                name: cryptoCoins[i].display_currency,
                fiat_val:
                  state.currencyPrice[cryptoCoins[i].coingecko_coin_name][currency],
                //TODO total_balance -> fiat_balance
                fiat_balance:
                  +balance *
                  +state.currencyPrice[cryptoCoins[i].coingecko_coin_name][currency],
              };
              tempErc20Balance = [...tempErc20Balance, tempBalancePerCoin];
            }
          }
        }
        tempBalanceAll = [...tempBalanceAll, { balance: tempBalance, erc20Balance: tempErc20Balance }];
      }
      state.balanceAll = [...state.balanceAll, ...tempBalanceAll];
    });
    builder.addCase(addBalanceAll.rejected, (state, action) => {
      state.balanceAllLoader = false;
      state.error = action.payload;
    });
    builder.addCase(getBalanceAll.pending, (state) => {
      state.balanceAllLoader = true;
    });
    builder.addCase(getBalanceAll.fulfilled, (state, action) => {
      state.balanceAllLoader = false;
      const cryptoCoins =
        localStorage.getItem("checkCrypto") &&
        JSON.parse(localStorage.getItem("checkCrypto"));

      const currency = localStorage.getItem("currency").toLowerCase();

      // let tempBalanceAll = action.payload;

      console.log('balanceAll', action.payload);
      let tempBalanceAll = [];
      for (let account of action.payload) {
        const { balance, erc20Balance } = account;
        let tempBalance = [];
        let tempErc20Balance = [];
        for (let i = 0; i < cryptoCoins.length; i++) {
          let tempBalancePerCoin;
          if (!cryptoCoins[i].is_erc20 && currency) {
            const bal = balance && balance[cryptoCoins[i].tatum_coin_name];

            if (bal) {
              tempBalancePerCoin = {
                balance: +bal,
                name: cryptoCoins[i].display_currency,
                fiat_val:
                  state.currencyPrice[cryptoCoins[i]?.coingecko_coin_name][currency],
                fiat_balance:
                  bal *
                  +state.currencyPrice[cryptoCoins[i]?.coingecko_coin_name][currency],
              }
              tempBalance = [...tempBalance, tempBalancePerCoin];
            }
          }

          if (cryptoCoins[i].is_erc20 && currency) {
            const balance = erc20Balance && erc20Balance[cryptoCoins[i].currency];
            // const balance = bal?.balance / 10 ** +bal?.decimals;
            if (balance) {
              tempBalancePerCoin = {
                balance: +balance,
                name: cryptoCoins[i].display_currency,
                fiat_val:
                  state.currencyPrice[cryptoCoins[i].coingecko_coin_name][currency],
                //TODO total_balance -> fiat_balance
                fiat_balance:
                  +balance *
                  +state.currencyPrice[cryptoCoins[i].coingecko_coin_name][currency],
              };
              tempErc20Balance = [...tempErc20Balance, tempBalancePerCoin];
            }
          }
        }
        tempBalanceAll = [...tempBalanceAll, { balance: tempBalance, erc20Balance: tempErc20Balance }];
      }
      state.balanceAll = tempBalanceAll;
      // console.log('balanceAll', tempBalanceAll)

    });
    builder.addCase(getBalanceAll.rejected, (state, action) => {
      state.balanceAllLoader = false;
      state.error = action.payload;
    });
    builder.addCase(getBalance.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(getBalance.fulfilled, (state, action) => {
      state.loader = false;

      const cryptoCoins =
        localStorage.getItem("checkCrypto") &&
        JSON.parse(localStorage.getItem("checkCrypto"));

      const currency = localStorage.getItem("currency").toLowerCase();

      let prevBalance = [...state.balance];
      let tempBalance;
      for (let i = 0; i < cryptoCoins.length; i++) {
        if (!cryptoCoins[i].is_erc20 && currency) {
          const bal =
            action.payload && action.payload[cryptoCoins[i].tatum_coin_name];
          console.log("action.payload", action.payload);

          if (bal) {
            console.log(
              "balanceInIf",
              bal,
              action.payload[cryptoCoins[i].tatum_coin_name]
            );
            tempBalance = {
              balance: +bal,
              name: cryptoCoins[i].display_currency,
              fiat_val:
                state.currencyPrice[cryptoCoins[i]?.coingecko_coin_name][
                currency
                ],
              fiat_balance:
                bal *
                +state.currencyPrice[cryptoCoins[i]?.coingecko_coin_name][
                currency
                ],
            };
          }
        } else {
          continue;
        }
      }
      // console.log("tempBalance", tempBalance);
      state.balance = [...prevBalance, tempBalance];
    });
    builder.addCase(getBalance.rejected, (state, action) => {
      state.loader = false;
      state.error = action.payload;
    });

    builder.addCase(getErc20Balance.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(getErc20Balance.fulfilled, (state, action) => {
      state.loader = false;

      const cryptoCoins =
        localStorage.getItem("checkCrypto") &&
        JSON.parse(localStorage.getItem("checkCrypto"));

      const currency = localStorage.getItem("currency").toLowerCase();

      let prevBalance = [...state.erc20Balance];
      let tempBalance;
      for (let i = 0; i < cryptoCoins.length; i++) {
        if (cryptoCoins[i].is_erc20 && currency) {
          const balance =
            action.payload && action.payload[cryptoCoins[i].currency];
          // const balance = bal?.balance / 10 ** +bal?.decimals;
          if (balance) {
            console.log(
              "balanceEth",
              balance,
              cryptoCoins[i].currency,
              state.currencyPrice[cryptoCoins[i].coingecko_coin_name][currency]
            );
            tempBalance = {
              balance: +balance,
              name: cryptoCoins[i].display_currency,
              fiat_val:
                state.currencyPrice[cryptoCoins[i].coingecko_coin_name][
                currency
                ],
              //TODO total_balance -> fiat_balance
              fiat_balance:
                +balance *
                +state.currencyPrice[cryptoCoins[i].coingecko_coin_name][
                currency
                ],
            };
          }
        } else {
          continue;
        }
      }
      state.erc20Balance = [...prevBalance, tempBalance];
    });
    builder.addCase(getErc20Balance.rejected, (state, action) => {
      state.loader = false;
      state.error = action.payload;
    });
    builder.addCase(coinBasedTokenBalance.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(coinBasedTokenBalance.fulfilled, (state, action) => {
      state.loader = false;
      state.tokenBalance = action.payload;
    });
    builder.addCase(coinBasedTokenBalance.rejected, (state, action) => {
      state.loader = false;
      state.error = action.payload;
    });
    builder.addCase(currencyPriceDetail.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(currencyPriceDetail.fulfilled, (state, action) => {
      state.loader = false;
      state.currencyPrice = action.payload;
    });
    builder.addCase(currencyPriceDetail.rejected, (state, action) => {
      state.loader = false;
      state.error = action.payload;
    });
    builder.addCase(clearBalance.fulfilled, (state, action) => {
      state.balance = [];
      state.erc20Balance = [];
    });

    builder.addCase(clearBalanceAll.fulfilled, (state, action) => {
      state.balanceAll = [];
    })
  },
});

export default balanceSlice.reducer;
