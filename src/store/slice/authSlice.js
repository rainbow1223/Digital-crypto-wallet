import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { generateWalletForCrypto } from "../../helpers/wallet";
import { addCurrency } from "../../constantsData/addCurrency";
import bcrypt from 'bcryptjs';
const bip39 = require("bip39");

export const signupPageAction = () => {
  localStorage.setItem('wordlist', bip39.wordlists['english']);
}

export const checksumVaildateAction = (mnemonics) => {
  return mnemonics.filter(mnemonic => {
    try {
      bip39.mnemonicToEntropy(mnemonic);
      return true;
      // console.log(mnemonic, ':', 'valid')
    } catch (err) {
      // console.log(mnemonic, ':', 'invalid mnemonic');
      return false;
    }
  })

  // console.log(mnemonic, bip39.mnemonicToEntropy(mnemonic));
}

export const addWalletAction = createAsyncThunk(
  "addWalletAction",
  async (data, thunkAPI) => {
    if (!data.params.length === 0) return;
    let resData = await JSON.parse(localStorage.getItem('user_crypto_currency_data'));
    let addData = [];
    let errorForResData = [];
    let cryptoData = await JSON.parse(localStorage.getItem("checkCrypto"));

    let mnemonics = await JSON.parse(localStorage.getItem('mnemonics'));
    for (let i = 0; i < data.params.length; i++) {
      let res = {};
      for (let crypto of cryptoData) {
        if (crypto.is_erc20) continue;
        try {
          res[crypto.currency] = await generateWalletForCrypto(
            data.params[i],
            crypto.currency
          );
        } catch (error) {
          errorForResData.push(error);
        }
      }
      addData.push(res);
      mnemonics.push(data.params[i]);
    }

    if (errorForResData.length === 0) {
      localStorage.setItem(
        "user_crypto_currency_data",
        JSON.stringify([...resData, ...addData])
      );
      localStorage.setItem("mnemonics", JSON.stringify(mnemonics));
      data.cb(null, addData);
    } else {
      data.cb(errorForResData, null);
    }

  }
);

export const createWalletAction = createAsyncThunk(
  "createWalletAction",
  async (data, thunkAPI) => {
    console.log('start creating wallet');
    if (!data.params.length === 0) return;

    let defaultCoin = addCurrency.filter((item, index) => item.default_enabled);
    let resData = [];
    let errorForResData = [];
    for (let i = 0; i < data.params.length; i++) {

      let cryptoData = defaultCoin;
      let res = {};
      for (let crypto of cryptoData) {
        if (crypto.is_erc20) continue;

        try {
          res[crypto.currency] = await generateWalletForCrypto(
            data.params[i],
            `${crypto.currency}`
          );
        } catch (error) {
          errorForResData.push(error);
        }
      }
      resData.push(res);
    }
    // console.log('abcde')

    // console.log('error', errorForResData)
    if (errorForResData.length === 0) {
      localStorage.setItem("checkCrypto", JSON.stringify(defaultCoin));
      // console.log('abcde', data.password)
      let hashedPassword = await bcrypt.hash(data.password, 10);
      // console.log('abcdefgh')
      // console.log(hashedPassword, ":", data.password)
      localStorage.setItem('password', hashedPassword);
      localStorage.setItem(
        "user_crypto_currency_data",
        JSON.stringify(resData)
      );
      // console.log(data.params)
      localStorage.setItem("mnemonics", JSON.stringify(data.params));
      // console.log(localStorage.getItem('mnemonics'))

      return data.cb(null, resData);
    } else {
      return data.cb(errorForResData[0], null);
    }
  }
);

export const loginPageAction = createAsyncThunk(
  "loginPageAction",
  async (data, thunkAPI) => {
    if (!data.params) {
      data.params = bip39.generateMnemonic();
    }

    // localStorage.clear();

    if (!localStorage.getItem("checkCrypto")) {
      const defaultCoin = addCurrency.filter((item, i) => item.default_enabled);
      // const defaultCoin = addCurrency;
      // console.log("defaultCoin", defaultCoin);
      await localStorage.setItem("checkCrypto", JSON.stringify(defaultCoin));
    }
    let resData = {};
    let errorForResData = [];
    let cryptoData = await JSON.parse(localStorage.getItem("checkCrypto"));

    for (let crypto of cryptoData) {
      if (crypto.is_erc20) continue;

      try {
        let res = await generateWalletForCrypto(
          data.params,
          `${crypto.currency}`
        );
        console.log("res:", res);
        resData[`${crypto.currency}`] = res;
      } catch (error) {
        errorForResData.push(error);
      }
    }
    if (errorForResData.length === 0) {
      localStorage.setItem(
        "user_crypto_currency_data",
        JSON.stringify(resData)
      );
      localStorage.setItem("mnemonics", data.params);
      data.cb(null, resData);
    } else {
      return data.cb(errorForResData[0], null);
    }
  }
);

const initialUser = localStorage.getItem("user_crypto_currency_data")
  ? JSON.parse(localStorage.getItem("user_crypto_currency_data"))
  : null;


const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: initialUser,
    error: null,
    loader: false,
    currentAccount: 0
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user_crypto_currency_data");
      localStorage.removeItem("checkCrypto");
      // localStorage.removeItem("mnemonics");
      localStorage.removeItem("ethereum");
    },
    setCurrentAccount: (state, action) => {
      state.currentAccount = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loginPageAction.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(loginPageAction.fulfilled, (state, action) => {
      state.loader = false;
      state.user = action.payload;
    });
    builder.addCase(loginPageAction.rejected, (state, action) => {
      state.loader = false;
      state.error = action.payload;
    });

    builder.addCase(createWalletAction.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(createWalletAction.fulfilled, (state, action) => {
      state.loader = false;
    });
    builder.addCase(createWalletAction.rejected, (state, action) => {
      state.loader = false;
    });
  },
});

export const { logout, setCurrentAccount } = authSlice.actions;

export default authSlice.reducer;
