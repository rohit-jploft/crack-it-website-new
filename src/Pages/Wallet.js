import "./../style.css";
import Header from "./Header";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Walletimg from "./../Images/wallet.svg";
import { getAllWithDrawal, getWallet } from "../data/wallet";
import { useContext, useEffect, useState } from "react";
import { getDateFromTimeStamps } from "../helper/helper";
import { useNavigate } from "react-router-dom";
import { isExpert } from "../utils/authHelper";
import { UserContext } from "../context/userContext";
import { Tab, Tabs } from "react-bootstrap";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "./Payment";
import { stripePromise } from "../data/stripePromise";

const Wallet = () => {
  const [walletData, setWalletData] = useState();
  const [withdrawalReqData, setWithDrawalReqData] = useState();
  const [key, setKey] = useState("Transaction");

  const { walletAmount, setWalletAmount } = useContext(UserContext);

  const navigate = useNavigate();
  const getWalletData = async () => {
    const data = await getWallet();
    setWalletData(data.data);
  };
  const getAllWithdrawalReq = async () => {
    const data = await getAllWithDrawal();
    setWithDrawalReqData(data.data);
  };
  useEffect(() => {
    getWalletData();
    getAllWithdrawalReq();
  }, [key]);
  useEffect(() => {
    setWalletAmount(walletData?.wallet?.amounst);
  }, []);
  const isThisExpert = isExpert();
  return (
    <>
      <Header />
      <section className="">
        <Container>
          <div className="main-content">
            <div className="wallet_field">
              <div>
                <div className="wallet_amount">
                  <p>Wallet Amount</p>
                  <h3>${walletData?.wallet?.amount}</h3>
                  {isThisExpert && (
                    <button
                      className="btn_withdraw"
                      onClick={() => {
                        navigate("/withdraw-amount");
                      }}
                    >
                      Withdraw
                    </button>
                  )}
                </div>
                {/* <h5>Transactions</h5> */}
                <div className="table-responsive wallet-table">
                  {isThisExpert && (
                    <Tabs
                      defaultActiveKey="profile"
                      id="uncontrolled-tab-example"
                      className="bookings_tabs"
                      activeKey={key}
                      fill
                      onSelect={(k) => setKey(k)}
                      width="100%"
                      style={{ width: "100%", marginInline: "auto" }}
                    >
                      <Tab
                        style={{ width: "100%" }}
                        eventKey="Transaction"
                        title="Transactions"
                      >
                        <Table width="100%">
                          {walletData &&
                            walletData.transactions &&
                            walletData.transactions.length > 0 && (
                              <thead>
                                <tr width="100%">
                                  <th width="1%"></th>
                                  <th width="15%">Name</th>
                                  <th width="24%">Date</th>
                                  <th width="15%">Status</th>
                                  <th width="15%">Amount</th>
                                </tr>
                              </thead>
                            )}
                          {walletData &&
                            walletData.transactions &&
                            walletData.transactions.length > 0 && (
                              <tbody>
                                {walletData?.transactions?.map(
                                  (transaction) => {
                                    const {
                                      amount,
                                      status,
                                      type,
                                      user,
                                      otherUser,
                                      createdAt,
                                    } = transaction;
                                    return (
                                      <tr>
                                        <td>
                                          <img
                                            className="wallet-img"
                                            src={Walletimg}
                                            alt="img"
                                          />
                                        </td>
                                        <td className="Wname">
                                          {otherUser?.firstName}{" "}
                                          {otherUser?.lastName}
                                        </td>
                                        <td>
                                          {getDateFromTimeStamps(createdAt)}
                                        </td>
                                        <td>
                                          <div className="status_success">
                                            {status}
                                          </div>
                                        </td>
                                        <td>
                                          <span
                                            className={`${
                                              type === "CREDIT" ? "C" : "D"
                                            }amount`}
                                          >
                                            {amount}
                                          </span>
                                        </td>
                                      </tr>
                                    );
                                  }
                                )}
                              </tbody>
                            )}
                        </Table>
                        {walletData &&
                          walletData.transactions &&
                          walletData.transactions.length === 0 && (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <span>No transactions</span>
                            </div>
                          )}
                      </Tab>
                      <Tab
                        style={{ width: "100%" }}
                        eventKey="Withdraw"
                        title="Withdrawal Request"
                      >
                        <Table width="100%">
                          {withdrawalReqData &&
                            withdrawalReqData.length > 0 && (
                              <thead>
                                <tr width="100%">
                                  <th width="1%"></th>
                                  <th width="15%">Type</th>
                                  <th width="15%">Bank Name</th>
                                  <th width="24%">Date</th>
                                  <th width="15%">Status</th>
                                  <th width="15%">Amount</th>
                                </tr>
                              </thead>
                            )}
                          {withdrawalReqData &&
                            withdrawalReqData.length > 0 && (
                              <tbody>
                                {withdrawalReqData?.map((withdraw) => {
                                  const {
                                    amount,
                                    status,
                                    type,
                                    bank,
                                    createdAt,
                                  } = withdraw;
                                  return (
                                    <tr>
                                      <td>
                                        <img
                                          className="wallet-img"
                                          src={Walletimg}
                                          alt="img"
                                        />
                                      </td>
                                      <td className="Wname">{bank?.type}</td>
                                      <td className="Wname">
                                        {bank?.type === "UPI"
                                          ? bank?.upiId
                                          : bank?.bankName}
                                      </td>
                                      <td>
                                        {getDateFromTimeStamps(createdAt)}
                                      </td>
                                      <td>
                                        <div
                                          className={`status_${
                                            status == "Pending"
                                              ? "pending"
                                              : "success"
                                          }`}
                                        >
                                          {status}
                                        </div>
                                      </td>
                                      <td>
                                        <span
                                          className={`${
                                            type === "CREDIT" ? "C" : "D"
                                          }amount`}
                                        >
                                          {amount}
                                        </span>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            )}
                        </Table>
                        {withdrawalReqData &&
                          withdrawalReqData.length === 0 && (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <span>No withdrawal transactions</span>
                            </div>
                          )}
                      </Tab>
                    </Tabs>
                  )}
                  {!isThisExpert && (
                    <Table width="100%">
                      {walletData &&
                        walletData.transactions &&
                        walletData.transactions.length > 0 && (
                          <thead>
                            <tr width="100%">
                              <th width="1%"></th>
                              <th width="15%">Name</th>
                              <th width="24%">Date</th>
                              <th width="15%">Status</th>
                              <th width="15%">Amount</th>
                            </tr>
                          </thead>
                        )}
                       {walletData &&
                        walletData.transactions &&
                        walletData.transactions.length > 0 && (<tbody>
                        {walletData?.transactions?.map((transaction) => {
                          const {
                            amount,
                            status,
                            type,
                            user,
                            otherUser,
                            createdAt,
                          } = transaction;
                          return (
                            <tr>
                              <td>
                                <img
                                  className="wallet-img"
                                  src={Walletimg}
                                  alt="img"
                                />
                              </td>
                              <td className="Wname">
                                {otherUser?.firstName} {otherUser?.lastName}
                              </td>
                              <td>{getDateFromTimeStamps(createdAt)}</td>
                              <td>
                                <div className="status_success">{status}</div>
                              </td>
                              <td>
                                <span
                                  className={`${
                                    type === "CREDIT" ? "C" : "D"
                                  }amount`}
                                >
                                  {amount}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>)}
                      {walletData && walletData.transactions &&
                      walletData.transactions.length === 0 && (
                        <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <span>No transactions</span>
                      </div>
                      )
                       
                    }
                    </Table>
                    
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default Wallet;
