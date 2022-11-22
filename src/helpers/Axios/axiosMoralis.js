import axios from "axios";

export const authHeadersMoralis = () => {
  return {
    headers: {
      "x-api-key": process.env.REACT_APP_MORALIS_API_KEY,
    },
  };
};

const AxiosMoralis = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_URL_MORALIS}`,
});

export default AxiosMoralis;
