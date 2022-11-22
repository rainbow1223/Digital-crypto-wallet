import React from "react";
import { Table } from "react-bootstrap";
import { receiveIcon, sendIcon } from "../../../icons";

const CmnTransactions = ({ transactions, allTransactions }) => {
  const allTransactionsCom = allTransactions
    ? allTransactions
      .flat()
      ?.sort((a, b) => new Date(b.time) - new Date(a.time))
    : transactions;
  return (
    <>
      <div className="overflow-auto">
        <Table className="zl_transaction_list_table">
          <thead>
            <tr>
              <th className="zl_transaction_list_table_heading">type</th>
              <th className="zl_transaction_list_table_heading">name</th>
              <th className="zl_transaction_list_table_heading">
                transaction id
              </th>
              <th className="zl_transaction_list_table_heading">value</th>
              <th className="zl_transaction_list_table_heading">status</th>
              <th className="zl_transaction_list_table_heading">date</th>
            </tr>
          </thead>
          <tbody>
            {allTransactionsCom &&
              allTransactionsCom.map((transactionListData, i) => (
                <tr key={i}>
                  <td className="zl_transaction_list_type">
                    <img
                      src={transactionListData?.image}
                      alt="transaction-icon"
                    />
                  </td>
                  <td className="zl_transaction_list_name">
                    {transactionListData?.name}
                  </td>
                  <td className="zl_transaction_list_id">
                    <a
                      href={`${transactionListData.coinLink}${transactionListData.hash}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {transactionListData.hash}
                    </a>
                  </td>
                  <td
                    className={`${transactionListData.classTransactions} zl_transaction_list_value`}
                  >
                    {transactionListData.transactionIcon === "receiveIcon"
                      ? receiveIcon
                      : sendIcon}{" "}
                    {transactionListData.value}
                  </td>
                  <td
                    className={`${transactionListData?.name === "ethereum"
                      ? transactionListData.receipt_status === "1"
                        ? "zl_transaction_completed"
                        : "zl_transaction_failed"
                      : "zl_transaction_completed"
                      }
                     zl_transaction_list_status`}
                  >
                    {transactionListData?.name === "ethereum"
                      ? transactionListData.receipt_status === "1"
                        ? "Completed"
                        : "Failed"
                      : "Completed"}
                  </td>
                  <td className="zl_transaction_list_date">
                    {transactionListData.time}
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default CmnTransactions;
