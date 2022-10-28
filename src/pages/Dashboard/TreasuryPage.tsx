import { useEffect, useState } from "react";
import "../../styles/App.css";
import "../../styles/CreateDao.css";
import "../../styles/Dashboard.css";
import "../../styles/Modal.css";
import "../../styles/Sidebar.css";
import { useMoralis } from "react-moralis";
import { useWeb3React } from "@web3-react/core";
import { tokenCallSafe } from "connection/DaoTokenCall";
import euro from "../../assets/svg/euro.svg";
import { LeapFrog } from "@uiball/loaders";
import {
  SafeTransactionData,
  SafeTransactionDataPartial,
} from "@gnosis.pm/safe-core-sdk-types";
import { ImportSafe, safeService } from "connection/SafeCall";
import { BiRefresh } from "react-icons/bi";
import { EthSignSignature } from "@gnosis.pm/safe-core-sdk";
const Dashboard = () => {
  const { Moralis } = useMoralis();
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [supply, setSupply] = useState(0);
  const { provider, account, chainId } = useWeb3React();
  const [recipient, setRecipient] = useState("");
  const [amount, setamount] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [tokens, settokens] = useState<any>([]);
  const [transactions, setTransactions] = useState<any>([]);
  const [pendingTransactions, setPendingTransactions] = useState<any>([]);
  const [safeTxHashs, setSafeTxhashs] = useState<string>("");
  const [safeAddress, setSafeAddress] = useState<string>("");

  useEffect(() => {
    getHistories();
  }, []);

  async function getHistories() {
    const daoinfo = Moralis.Object.extend("DAOInfo");
    const query = new Moralis.Query(daoinfo);
    const results = await query.find({ useMasterKey: true });
    const lastIndex = results.length - 1;
    setTokenName(results[lastIndex].get("tokenName"));
    setTokenSymbol(results[lastIndex].get("tokenSymbol"));
    setSupply(parseInt(results[lastIndex].get("supply")));
    setSafeAddress(results[lastIndex].get("holder"));
  }

  const createTransaction = async () => {
    setisLoading(true);
    const token = await tokenCallSafe(tokenAddress);
    const tokenAmount = BigInt(parseInt(amount) * 10 ** 18);
    const safeSDK = await ImportSafe(provider, safeAddress);
    const safeTransactionData: SafeTransactionDataPartial = {
      to: tokenAddress,
      data: (await token.populateTransaction.transfer(recipient, tokenAmount))
        .data as string,
      value: "0",
    };
    const safeTransaction = await safeSDK.createTransaction({
      safeTransactionData,
    });
    console.log(safeTransaction.data);
    const safeTxHash = await safeSDK.getTransactionHash(safeTransaction);
    setSafeTxhashs(safeTxHash);
    const senderSignature = await safeSDK.signTransactionHash(safeTxHash);
    const senderAddress = account as string;
    (await safeService(provider, `${chainId}`))
      .proposeTransaction({
        safeAddress,
        safeTransactionData: safeTransaction.data,
        safeTxHash,
        senderAddress,
        senderSignature: senderSignature.data,
      })
      .then((value) => {
        console.log("transaction has been proposed");
        setisLoading(false);
      })
      .catch((error) => {
        console.log("an error occoured while proposing transaction", error);
        setisLoading(false);
      });
    await (
      await safeService(provider, `${chainId}`)
    )
      .confirmTransaction(safeTxHash, senderSignature.data)
      .then((success) => {
        setisLoading(false);
        console.log("transaction is successful");
      })
      .catch((err) => {
        console.log("error occured while confirming transaction", err);
        setisLoading(false);
      });
    setisLoading(false);
  };

  const getPendingTransactions = async () => {
    console.log(tokens);
    const pendingTxs = await (
      await safeService(provider, `${chainId}`)
    ).getPendingTransactions(safeAddress);
    setPendingTransactions(pendingTxs.results);
    console.log(pendingTxs);
  };

  useEffect(() => {
    getTokens();
    getPendingTransactions();
  }, [safeAddress, provider]);

  const getTokens = async () => {
    const tokens = await (await safeService(provider, `${chainId}`)).getBalances(safeAddress);
    settokens(tokens);
  };

  const getTransactions = async () => {
    const Txs = await (
      await safeService(provider, `${chainId}`)
    ).getAllTransactions(safeAddress);
    setTransactions(Txs.results);
    console.log(Txs.results);
  };

  const hasUserApproved = async (_safeTxHashs: string) => {
    let approved: boolean = false;
    const Txs = await (
      await safeService(provider, `${chainId}`)
    ).getTransactionConfirmations(_safeTxHashs);
    Txs.results.map((result: any) => {
      if (result.owner === account) {
        approved = true;
      }
    });
    return approved;
  };

  const confirmTransaction = async (_safeTxHashs: string) => {
    const safeSDK = await ImportSafe(provider, safeAddress);
    const isOwner = await safeSDK.isOwner(account as string);
    const approvedOrNot = await hasUserApproved(_safeTxHashs);
    if (isOwner && !approvedOrNot) {
      const senderSignature = await safeSDK.signTransactionHash(_safeTxHashs);
      await (
        await safeService(provider, `${chainId}`)
      )
        .confirmTransaction(_safeTxHashs, senderSignature.data)
        .then((success) => {
          console.log("User confirmed the transaction");
        })
        .catch((err) => {
          console.log("error occured while confirming transaction", err);
        });
    } else {
      console.log("sorry you already approved the transaction");
    }
  };
  const rejectTransaction = async (_safeTxHashs: any, _nonce: any) => {
    console.log("this is nonce:", _nonce);
    const safeSDK = await ImportSafe(provider, safeAddress);
    const transaction = await safeSDK.createRejectionTransaction(_nonce);
    const hash = (await safeSDK.signTransaction(transaction)).data;

    await (
      await safeService(provider, `${chainId}`)
    )
      .confirmTransaction(_safeTxHashs, hash.data)
      .then((success) => {
        console.log("User has rejected the Transaction");
      })
      .catch((err) => {
        console.log("Error occured while rejecting the transaction:", err);
      });
  };

  const executeTransactions = async (_txs: any) => {
    console.log(_txs);
    const safeSDK = await ImportSafe(provider, safeAddress);
    const safeTransactionData: SafeTransactionData = {
      to: _txs.to,
      value: _txs.value,
      data: _txs.data,
      operation: _txs.operation,
      safeTxGas: _txs.safeTxGas,
      baseGas: _txs.baseGas,
      gasPrice: _txs.gasPrice,
      gasToken: _txs.gasToken,
      refundReceiver: _txs.refundReceiver,
      nonce: _txs.nonce,
    };
    const safeTransaction = await safeSDK.createTransaction({
      safeTransactionData,
    });
    _txs.confirmations.forEach((confirmation: any) => {
      const signature = new EthSignSignature(
        confirmation.owner,
        confirmation.signature
      );
      safeTransaction.addSignature(signature);
    });
    const executeTxResponse = await safeSDK.executeTransaction(safeTransaction);
    const receipt =
      executeTxResponse.transactionResponse &&
      (await executeTxResponse.transactionResponse.wait());
    console.log("confirmed", receipt);
  };

  const checkApproved = (_txs: any) => {
    const confirmations: number = _txs.confirmations.length;
    let isApproved = false;
    _txs.confirmations.map((result: any, index: any) => {
      if (result.owner.includes(account)) {
        isApproved = true;
      }
    });
    const show = isApproved ? (
      <>
        <button
          id="buttonDeploy"
          className={"nextButton"}
          style={{
            background: confirmations === 3 ? "#C94B32" : "#76808D",
            position: "relative",
            left: 0,
            marginBottom: 5,
            marginRight: 5,
            textAlign: "center",
          }}
          disabled={confirmations === 3 ? false : true}
          onClick={() => {
            executeTransactions(_txs);
          }}
        >
          Execute
        </button>
      </>
    ) : (
      <>
        <button
          id="buttonDeploy"
          className={"nextButton"}
          style={{
            background: "#C94B32",
            position: "relative",
            left: 0,
            marginBottom: 5,
            marginRight: 5,
            textAlign: "center",
          }}
          onClick={() => {
            confirmTransaction(_txs.safeTxHash);
          }}
        >
          Confirm
        </button>
        <button
          id="buttonDeploy"
          className={"nextButton"}
          style={{
            background: "#C94B32",
            position: "relative",
            left: 0,
            marginBottom: 5,
            textAlign: "center",
          }}
          onClick={() => {
            rejectTransaction(_txs.safeTxHash, _txs.nonce);
          }}
        >
          Reject
        </button>
      </>
    );
    return show;
  };

  useEffect(() => {
    console.log(tokenAddress);
  }, [tokenAddress]);

  return (
    <>
      <div
        className={"something"}
        style={{
          paddingLeft: 480,
          paddingTop: 100,
          paddingBottom: 100,
          height: 1600,
        }}
      >
        <div className={"pageTitle"}>Treasury</div>
        <div>
          <div className="sendToken">
            <div className={"ItemHeader"}>Send Token</div>
            <select
              style={{
                width: 340,
                height: 40,
                backgroundColor: "#f5f5f5",
                borderRadius: "10px",
                padding: "0px 10px 0px 10px",
                margin: "18px 0px 18px 0px",
              }}
              placeholder="select token"
              onChange={(e) => setTokenAddress(e.target.value)}
            >
              {tokens
                ? tokens.map((token: any, index: any) =>
                    token.tokenAddress !== null ? (
                      <option key={index} value={token.tokenAddress}>
                        {token.token.symbol}
                      </option>
                    ) : null
                  )
                : null}
            </select>
            <input
              className={"dashboardInputField"}
              type="text"
              name="recipient"
              style={{ height: 40, width: 340 }}
              autoFocus
              placeholder="Recipient Address"
              value={recipient}
              onChange={(e) => {
                setRecipient(e.target.value);
              }}
            />
            <input
              className={"dashboardInputField"}
              type="number"
              name="amount"
              style={{ height: 40, width: 340, marginTop: 5 }}
              placeholder="Enter Amount"
              value={amount}
              onChange={(e) => {
                setamount(e.target.value);
              }}
            />
            <button
              id="buttonDeploy"
              className={"nextButton"}
              style={{
                background: "#C94B32",
                position: "relative",
                left: 0,
                marginTop: 5,
                textAlign: "center",
              }}
              onClick={createTransaction}
            >
              {isLoading ? (
                <div style={{ marginLeft: 48 }}>
                  <LeapFrog size={20} color="#FFFFFF" />
                </div>
              ) : (
                "Send"
              )}
            </button>
            <div className={"message"} style={{ width: "486px" }}>
              {message}
            </div>
          </div>
          {/* side component */}
          <div className="treasurySideComponent">
            <div className="ItemHeader">{tokenName}</div>
            <div className="Itemdesc">Token Name</div>
            <img src={euro} alt="euro" className="euro" />
            <div className="ItemHeader">{tokenSymbol}</div>
            <div className="Itemdesc">Token Symbol</div>
            <img src={euro} alt="euro" className="euro" />
            <div className="ItemHeader">{supply}</div>
            <div className="Itemdesc">Total Supply</div>
          </div>
          <div>
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div className={"ItemHeader"}>Pending Transactions</div>
                <BiRefresh
                  color="grey"
                  style={{ height: 35, width: 35, marginTop: 25 }}
                  onClick={getPendingTransactions}
                />
              </div>
              <div>
                <table>
                  <tr>
                    <th>Token</th>
                    <th>Amount</th>
                    <th>Recipient</th>
                    <th>status</th>
                  </tr>
                  {pendingTransactions.length >= 1
                    ? pendingTransactions.map((txs: any, index: any) => (
                        <tr>
                          <td>
                            {txs.to.slice(0, 8) + "..." + txs.to.slice(-6)}
                          </td>
                          <td>
                            {parseInt(txs.dataDecoded.parameters[1].value) /
                              10 ** 18}
                          </td>
                          <td>
                            {txs.dataDecoded.parameters[0].value.slice(0, 8) +
                              "..." +
                              txs.dataDecoded.parameters[0].value.slice(-6)}
                          </td>
                          <td>{checkApproved(txs)}</td>
                        </tr>
                      ))
                    : null}
                </table>
              </div>
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div className={"ItemHeader"}>Transactions</div>
                <BiRefresh
                  color="grey"
                  style={{ height: 35, width: 35, marginTop: 25 }}
                  onClick={getTransactions}
                />
              </div>
              <div>
                {transactions.length >= 1
                  ? transactions.map((txs: any, index: any) => (
                      <p>{txs.txHash}</p>
                    ))
                  : "No transactions found"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
