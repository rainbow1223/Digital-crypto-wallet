import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AxiosMoralis, {
  authHeadersMoralis,
} from "../../helpers/Axios/axiosMoralis";
import AxiosTatum, { authHeadersTatum } from "../../helpers/Axios/axiosTatum";

export const getTransactions = createAsyncThunk(
  "getTransactions",
  async (data, thunkAPI) => {
    const cryptoCoins = JSON.parse(localStorage.getItem("checkCrypto"));
    try {
      if (data.coin_type === "bitcoin") {
        const response = await AxiosTatum.get(
          `/${data.coin}/transaction/address/${data.address}?pageSize=20&offset=0`,
          // `/${data.coin}/transaction/address/${data.address}?pageSize=20&offset=0`,
          authHeadersTatum()
        );
        console.log('reee', response)
        response.data.map((obj) => {
          obj["name"] = data.coin;
          obj["key"] = cryptoCoins.filter(
            (obj) => obj.tatum_coin_name === data.coin
          )[0].currency;
          obj["coinLink"] = cryptoCoins.filter(
            (obj) => obj.tatum_coin_name === data.coin
          )[0].transaction_link;
          obj["image"] = cryptoCoins.filter(
            (obj) => obj.tatum_coin_name === data.coin
          )[0].image;
          obj["coin_type"] = cryptoCoins.filter(
            (obj) => obj.tatum_coin_name === data.coin
          )[0].coin_type;
          return true;
        });
        console.log("responseDATA)))", [data.coin], response.data);
        return { [data.coin]: response.data, currentAccount: data.currentAccount };
      } else {
        // const response = await AxiosTatum.get(`/`)
        const response = await AxiosMoralis.get(
          `/${data.address}?chain=${data.chain}&limit=20`,
          authHeadersMoralis()
        );
        response.data.result.map((obj) => {
          obj["name"] = data.coin;
          obj["key"] = cryptoCoins.filter(
            (obj) => obj.moralis_coin_name === data.coin
          )[0].currency;
          obj["coinLink"] = cryptoCoins.filter(
            (obj) => obj.moralis_coin_name === data.coin
          )[0].transaction_link;
          obj["image"] = cryptoCoins.filter(
            (obj) => obj.moralis_coin_name === data.coin
          )[0].image;
          obj["coin_type"] = cryptoCoins.filter(
            (obj) => obj.moralis_coin_name === data.coin
          )[0].coin_type;
          return true;
        });
        console.log("responseDATA)))", [data.coin], response.data.result);
        return { [data.coin]: response.data.result, currentAccount: data.currentAccount };
      }
    } catch (error) {
      console.log("error", error);
    }
  }
);

export const getErc20Transactions = createAsyncThunk(
  "getErc20Transactions",
  async (data, thunkAPI) => {
    try {
      const response = await AxiosMoralis.get(
        `/${data.address}/erc20/transfers?chain=${data.chain}`,
        authHeadersMoralis()
      );
      console.log("responseETH", data.contract_address, response.data.result);
      return {
        [data.contract_address]: response.data.result?.filter(
          (item) => item.address === data.contract_address
        )
        , currentAccount: data.currentAccount
      };
    } catch (error) {
      console.log("error", error.response);
      return error.response;
    }
  }
);

export const clearTransactions = createAsyncThunk(
  "clearTransactions",
  async (data, thunkAPI) => {
    return;
  }
);

const transactionSlice = createSlice({
  name: "transaction",
  initialState: {
    transactions: {},
    error: null,
    loader: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTransactions.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(getTransactions.fulfilled, (state, action) => {
      state.loader = false;

      console.log('action', action);

      const transactionValue = (data, coin, currentAccount) => {
        if (
          data?.inputs?.filter(
            (obj) =>
              obj.coin.address ===
              JSON.parse(localStorage.getItem("user_crypto_currency_data"))[currentAccount][
                coin
              ]?.address
          ).length > 0
        ) {
          return (
            data?.outputs?.filter(
              (obj) =>
                obj.address !==
                JSON.parse(localStorage.getItem("user_crypto_currency_data"))[currentAccount][
                  coin
                ]?.address
            )[0].value /
            10 ** 8
          );
        } else {
          return (
            data?.outputs?.filter(
              (obj) =>
                obj.address ===
                JSON.parse(localStorage.getItem("user_crypto_currency_data"))[currentAccount][
                  coin
                ]?.address
            )[0].value /
            10 ** 8
          );
        }
      };

      const creditDebit = (data, coin, currentAccount) => {
        if (
          data?.inputs?.filter(
            (obj) =>
              obj.coin.address ===
              JSON.parse(localStorage.getItem("user_crypto_currency_data"))[currentAccount][
                coin
              ]?.address
          ).length > 0
        ) {
          return "zl_transaction_minas";
        } else {
          return "zl_transaction_pluse";
        }
      };

      const dateTime = (time) => {
        return new Date(time).toDateString();
      };

      const cryptoCoins = JSON.parse(localStorage.getItem("checkCrypto"));

      let prevTransaction = { ...state.transactions };
      let tempTransaction;
      for (let i = 0; i < cryptoCoins.length; i++) {
        if (!cryptoCoins[i].is_erc20) {
          state.transactions[cryptoCoins[i].coingecko_coin_name] =
            action.payload &&
            action.payload[cryptoCoins[i].coingecko_coin_name];

          if (state.transactions[cryptoCoins[i].coingecko_coin_name]) {
            tempTransaction = {
              [cryptoCoins[i].coingecko_coin_name]: action.payload[
                cryptoCoins[i].coingecko_coin_name
              ].map((item, i) => {
                // console.log([1, 3, 2].findIndex(value => 3 === value))
                // console.log('addresses', JSON.parse(localStorage.getItem("user_crypto_currency_data")).findIndex(account=>account[item.key]?.address === ));
                return {
                  name: item.name,
                  image: item.image,
                  key: item.key,
                  coinLink: item.coinLink,
                  classTransactions:
                    item.coin_type === "bitcoin"
                      ? creditDebit(item, item.key, action.payload.currentAccount)
                      : item?.from_address !==
                        JSON.parse(
                          localStorage.getItem("user_crypto_currency_data")
                        )[action.payload.currentAccount][item.key]?.address
                        ? "zl_transaction_pluse"
                        : "zl_transaction_minas",
                  transactionIcon:
                    item.coin_type === "bitcoin"
                      ? creditDebit(item, item.key, action.payload.currentAccount) === "zl_transaction_pluse"
                        ? "receiveIcon"
                        : "sendIcon"
                      : item?.from_address !==
                        JSON.parse(
                          localStorage.getItem("user_crypto_currency_data")
                        )[action.payload.currentAccount][item.key]?.address
                        ? "receiveIcon"
                        : "sendIcon",
                  value:
                    item.coin_type === "bitcoin"
                      ? transactionValue(item, item.key, action.payload.currentAccount)
                      : Number(item.value) / 10 ** 18,
                  receipt_status: item.receipt_status,
                  hash: item.hash,
                  time:
                    item.coin_type === "bitcoin"
                      ? dateTime(new Date(item.time * 1000))
                      : dateTime(new Date(item.block_timestamp)),
                };
              }),
            };
            console.log("tempTransaction", tempTransaction);
          }
        } else {
          continue;
        }
      }
      state.transactions = { ...prevTransaction, ...tempTransaction };
    });
    builder.addCase(getTransactions.rejected, (state, action) => {
      state.loader = false;
      state.error = action.payload;
    });

    builder.addCase(getErc20Transactions.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(getErc20Transactions.fulfilled, (state, action) => {
      state.loader = false;
      const dateTime = (time) => {
        return new Date(time).toDateString();
      };

      localStorage.getItem("checkCrypto") &&
        JSON.parse(localStorage.getItem("checkCrypto")).filter((it, i) => {
          if (it.contract_address && action.payload[it.contract_address]) {
            return (state.transactions[it.contract_address] = action.payload[
              it.contract_address
            ].map((th, i) => {
              th["name"] = it.currency;
              th["image"] = it.image;
              th["coinLink"] = it.transaction_link;
              th["digits"] = it.digits;
              th["currency"] = it.currency;
              return {
                name: th.name,
                image: th.image,
                coinLink: th.coinLink,
                classTransactions:
                  th?.from_address !==
                    JSON.parse(localStorage.getItem("user_crypto_currency_data"))[action.payload.currentAccount][
                      th?.currency
                    ]?.address
                    ? "zl_transaction_pluse"
                    : "zl_transaction_minas",
                transactionIcon:
                  th?.from_address !==
                    JSON.parse(localStorage.getItem("user_crypto_currency_data"))[action.payload.currentAccount][
                      th?.currency
                    ]?.address
                    ? "receiveIcon"
                    : "sendIcon",
                hash: th.transaction_hash,
                from_address: th.from_address,
                to_address: th.to_address,
                value: Number(th.value) / 10 ** th.digits,
                block_hash: th.block_hash,
                time: dateTime(new Date(th.block_timestamp)),
              };
            }));
          }
        });
    });
    builder.addCase(getErc20Transactions.rejected, (state, action) => {
      state.loader = false;
      state.error = action.payload;
    });

    builder.addCase(clearTransactions.fulfilled, (state, action) => {
      state.loader = false;
      for (const trans in state.transactions) {
        state.transactions[trans] = null;
      }
    });
  },
});

export default transactionSlice.reducer;
