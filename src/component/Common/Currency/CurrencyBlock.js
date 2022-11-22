import React from "react";
import { Sparklines, SparklinesLine, SparklinesSpots } from "react-sparklines";
import { decreaseIcon, increaseIcon } from "../../../icons";

const CurrencyBlock = ({ coinMarketData, crypto, chartData }) => {
  const smallChartData = chartData[crypto?.coingecko_coin_name]?.prices?.map(
    (item) => item[1]
  );

  const smallChart = smallChartData?.slice(
    smallChartData.length - 20,
    smallChartData.length
  );

  const coinMarketChange = coinMarketData?.filter(
    (item, i) => item.name === crypto?.coingecko_coin_name
  )[0]?.change_in_24_hour;

  return (
    <>
      <div className="zl_add_currency_icon_chart">
        <div className="zl_currency_icon">
          <img src={crypto.image} alt={crypto?.name} />
        </div>
        <Sparklines
          data={smallChart}
          margin={6}
          className="zl_add_currency_mini_chart"
        >
          <SparklinesLine
            style={{
              strokeWidth: 10,
              stroke: "#fec74f",
              fill: "none",
              curve: "smooth",
            }}
          />
          <SparklinesSpots
            size={4}
            style={{
              stroke: "#fec74f",
              strokeWidth: 3,
              fill: "white",
            }}
          />
        </Sparklines>
      </div>
      <div className="zl_add_currency_price">
        <div className="zl_add_currency_left_price">
          <h3>{crypto?.balance?.name}</h3>
          <p>{crypto?.balance?.balance?.toFixed(6)}</p>
        </div>
        <div className="zl_add_currency_right_price">
          <span
            className={
              coinMarketChange < 0
                ? `zl_add_currency_right_price_negative`
                : `zl_add_currency_right_price_positive`
            }
          >
            {coinMarketChange < 0 ? decreaseIcon : increaseIcon}
            {coinMarketChange?.toFixed(2)}%
          </span>
          <p>${crypto?.balance?.fiat_balance?.toFixed(6)}</p>
        </div>
      </div>
    </>
  );
};

export default CurrencyBlock;
