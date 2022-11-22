import axios from "axios";

export const authHeadersCoingecko = (currentAccount) => {
  const authToken =
    localStorage.getItem("user_crypto_currency_data") &&
    JSON.parse(localStorage.getItem("user_crypto_currency_data"))[currentAccount].token;
  return {
    headers: { Authorization: `bearer ${authToken}` },
  };
};

const AxiosCoingecko = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_URL_COINGECKO}`,
});

export default AxiosCoingecko;
