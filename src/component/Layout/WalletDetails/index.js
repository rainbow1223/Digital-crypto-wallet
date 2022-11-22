import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Chart from "react-apexcharts";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  decreaseIcon,
  increaseIcon,
  receiveWhiteIcon,
  sendWhiteIcon,
} from "../../../icons";
import { routes } from "../../../constants";
import TransactionForm from "./TransactionForm";
import { getCoinLargeChart } from "../../../store/slice/chartSlice";
import CmnTransactions from "../TransactionList/CmnTransactions";

const WalletDetails = (props) => {
  const {
    coingecko_coin_name,
    transactions,
    keyCoin,
    display_currency,
    is_erc20,
    coin_type,
    coin_name,
    tatum_coin_name,
  } = props;
  // console.log("props", props);

  const dispatch = useDispatch();

  const balance = useSelector((state) => state.balance.balance);

  const erc20Balance = useSelector((state) => state.balance.erc20Balance);

  const balanceArr = [...balance, ...erc20Balance];

  const coinBalance =
    !balanceArr.includes(undefined) &&
    balanceArr?.filter((item) => item.name === display_currency)[0];

  console.log("coinBalance", coinBalance);

  // date picker
  const [dateRange, setDateRange] = useState([
    new Date("01 Mar 2022"),
    new Date(),
  ]);
  const [startDate, endDate] = dateRange;
  const from_date = (startDate?.getTime() / 1000).toFixed();
  const to_date = endDate && (endDate?.getTime() / 1000).toFixed();

  // send btn
  const [send, setSend] = useState(false);

  const handleToggle = (key) => {
    setSend(!send);
  };

  const coinMarketData = useSelector((state) => state.coinMarket.coinMarket);
  const marketData = coinMarketData?.filter(
    (item, i) => item.name === coingecko_coin_name
  )[0]?.change_in_24_hour;

  const chartData = useSelector((state) => state.chart.chartLarge);

  const largeChartData = chartData[
    coingecko_coin_name
  ]?.prices?.map((item, i) => [item[0], +item[1].toFixed(2)]);

  useEffect(() => {
    dispatch(
      getCoinLargeChart({
        coin: coingecko_coin_name,
        from_date: from_date,
        to_date: to_date || (new Date()?.getTime() / 1000).toFixed(),
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, to_date, coingecko_coin_name]);

  const options = to_date && [
    {
      chart: {
        zoom: {
          enabled: true,
        },
        stacked: false,
        type: "area",
      },
      xaxis: {
        categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        borderColor: "#999",
        yAxisIndex: 0,
        type: "datetime",
        min: startDate?.getTime() || new Date("01 Mar 2022").getTime(),
        tickAmount: 6,
        x: endDate?.getTime() || new Date().getTime(),
        label: {
          show: true,
          text: "Support",
          style: {
            colors: ["#fff"],
            background: "#00E396",
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 2,
        curve: "smooth",
        colors: ["#F7931A"],
      },
      fill: {
        type: "gradient",
        colors: ["rgba(247, 147, 26, 0.33)", "rgba(45, 55, 83, 0)"],
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.2,
          stops: [0, 90, 100],
        },
      },
      series: [
        {
          name: "series-1",
          type: "area",
          data: largeChartData,
        },
      ],
    },
  ];

  return (
    <>
      <div className={`zl_chart_component ${send ? "active" : ""}`}>
        <div className="zl_all_page_comman_content">
          <div className="zl_chart_box_heading_date">
            <h2 className="zl_chart_box_heading">{display_currency}</h2>
            <div className="position-relative">
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => {
                  setDateRange(update);
                }}
                isClearable={true}
                dateFormat="MMM, yyyy"
              />
            </div>
          </div>
          <div className="zl_dashboard_chart">
            {options && to_date && (
              <Chart
                options={options[0]}
                series={options[0].series}
                type="area"
                width="100%"
                height={350}
              />
            )}
          </div>
          <div className="zl_wallet_chart_bottom_content">
            <div className="zl_all_page_comman_total_price">
              <p className="zl_all_page_total_price_heading">Total Balance</p>
              <h2 className="zl_all_page_total_price_text">
                $ {coinBalance?.fiat_balance?.toFixed(4)}
                {' '}&nbsp;&nbsp;&nbsp;{coinBalance?.balance?.toFixed(6)}{' '}{coin_name ? coin_name : keyCoin}
              </h2>
              <span
                className={
                  marketData < 0
                    ? `zl_add_currency_right_price_negative`
                    : `zl_add_currency_right_price_positive`
                }
              >
                {marketData < 0 ? decreaseIcon : increaseIcon}
                {marketData} %
              </span>
            </div>
            <div className="zl_wallet_chart_send_recive_btn">
              <Button
                className="zl_wallet_chart_send_btn"
                onClick={() => handleToggle(keyCoin)}
              >
                {sendWhiteIcon}
                Send
              </Button>
              <Button
                className="zl_wallet_chart_recive_btn"
                onClick={() => handleToggle(keyCoin)}
              >
                {receiveWhiteIcon}
                Receive
              </Button>
            </div>
          </div>
        </div>

        <TransactionForm
          keyCoin={keyCoin}
          coin_type={coin_type}
          coingecko_coin_name={coingecko_coin_name}
          is_erc20={is_erc20}
          coin_name={coin_name}
          display_currency={display_currency}
          tatum_coin_name={tatum_coin_name}
        />

        <div className="zl_transaction_list">
          <h3 className="zl_transaction_list_main_heading">
            Transaction
            <Link to={routes.historyPage}>See All</Link>
          </h3>
          {transactions && transactions.length > 0 ? (
            <CmnTransactions transactions={transactions} />
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default WalletDetails;
