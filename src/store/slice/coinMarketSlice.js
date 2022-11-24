import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AxiosCoingecko from "../../helpers/Axios/axiosCoingecko";

export const getCoinMarketDetail = createAsyncThunk(
  "getCoinMarketDetail",
  async (data, thunkAPI) => {
    try {
      const response = await AxiosCoingecko.get(
        `/coins/markets?vs_currency=usd&ids=${data}&order=market_cap_desc&per_page=100&page=1`
      );
      return response.data;
    } catch (error) {
      console.log("error", error);
    }
  }
);

const coinMarketSlice = createSlice({
  name: "coinMarket",
  initialState: {
    coinMarket: [],
    error: null,
    loader: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCoinMarketDetail.pending, (state) => {
      state.loader = true;
    });
    builder.addCase(getCoinMarketDetail.fulfilled, (state, action) => {
      state.loader = false;
      state.coinMarket = action.payload?.map((item, i) => {
        return {
          name: item.id,
          image: item.image,
          change_in_24_hour: item.market_cap_change_percentage_24h,
        };
      });
    });
    builder.addCase(getCoinMarketDetail.rejected, (state, action) => {
      state.loader = false;
      state.error = action.payload;
    });
  },
});

export default coinMarketSlice.reducer;
