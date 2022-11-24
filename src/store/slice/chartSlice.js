import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AxiosCoingecko from "../../helpers/Axios/axiosCoingecko";

export const getCoinChart = createAsyncThunk(
  "getCoinChart",
  async (data, thunkAPI) => {
    try {
      const response = await AxiosCoingecko.get(
        `/coins/${data.coin}/market_chart/range?vs_currency=${data.currency ||
        "usd"}&from=${data.from_date}&to=${data.to_date}`
      );
      // console.log('chart', response.data)
      return { [data.coin]: response.data };
    } catch (error) {
      console.log("error", error);
    }
  }
);

export const getCoinLargeChart = createAsyncThunk(
  "getCoinLargeChart",
  async (data, thunkAPI) => {
    try {
      const response = await AxiosCoingecko.get(
        `/coins/${data.coin}/market_chart/range?vs_currency=${data.currency ||
        "usd"}&from=${data.from_date}&to=${data.to_date}`
      );
      console.log('largechart', response.data)
      return { [data.coin]: response.data };
    } catch (error) {
      console.log("error", error);
    }
  }
);

const chartSlice = createSlice({
  name: "chart",
  initialState: {
    chartSmall: {},
    chartLarge: {},
    error: null,
    loader: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCoinChart.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(getCoinChart.fulfilled, (state, action) => {
      state.loader = false;

      const cryptoCoins =
        localStorage.getItem("checkCrypto") &&
        JSON.parse(localStorage.getItem("checkCrypto"));

      const prevChart = { ...state.chartSmall };
      let tempChart;

      for (let i = 0; i < cryptoCoins.length; i++) {
        const name = cryptoCoins[i].coingecko_coin_name;
        const chart =
          action.payload && action.payload[cryptoCoins[i].coingecko_coin_name];
        if (chart) {
          tempChart = { [name]: chart };
        }
      }
      state.chartSmall = { ...prevChart, ...tempChart };
    });
    builder.addCase(getCoinChart.rejected, (state, action) => {
      state.loader = false;
      state.error = action.payload;
    });

    builder.addCase(getCoinLargeChart.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(getCoinLargeChart.fulfilled, (state, action) => {
      state.loader = false;

      const cryptoCoins =
        localStorage.getItem("checkCrypto") &&
        JSON.parse(localStorage.getItem("checkCrypto"));

      const prevChart = { ...state.chartLarge };
      let tempChart;

      for (let i = 0; i < cryptoCoins.length; i++) {
        const name = cryptoCoins[i].coingecko_coin_name;
        const chart =
          action.payload && action.payload[cryptoCoins[i].coingecko_coin_name];
        if (chart) {
          tempChart = { [name]: chart };
        }
      }
      state.chartLarge = { ...prevChart, ...tempChart };
    });
    builder.addCase(getCoinLargeChart.rejected, (state, action) => {
      state.loader = false;
      state.error = action.payload;
    });
  },
});

export default chartSlice.reducer;
