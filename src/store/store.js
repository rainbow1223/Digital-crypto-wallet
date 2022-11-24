import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/authSlice";
import balanceSlice from "./slice/balanceSlice";
import chartSlice from "./slice/chartSlice";
import coinMarketSlice from "./slice/coinMarketSlice";
import transactionSlice from "./slice/transactionSlice";

const store = configureStore({
  reducer: {

    
    auth: authSlice,
    transactions: transactionSlice,
    balance: balanceSlice,
    chart: chartSlice,
    coinMarket: coinMarketSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export default store;
