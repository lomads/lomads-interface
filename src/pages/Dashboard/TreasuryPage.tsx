import { useEffect, useState } from "react";
import "../../styles/App.css";
import "../../styles/CreateDao.css";
import "../../styles/Dashboard.css";
import "../../styles/Modal.css";
import "../../styles/Sidebar.css";
import { useAppSelector } from "state/hooks";
import { useMoralis } from "react-moralis";
import { useWeb3React } from "@web3-react/core";
import { tokenCall } from "connection/DaoTokenCall";
import euro from "../../assets/svg/euro.svg";
import { LeapFrog } from "@uiball/loaders";

const Dashboard = () => {
  const tokenAddress = useAppSelector(
    (state) => state.proposal.deployedTokenAddress
  );
  const { Moralis } = useMoralis();
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [supply, setSupply] = useState("");

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
    setSupply(results[lastIndex].get("supply"));
  }

  const { provider } = useWeb3React();
  const [recipient, setRecipient] = useState("");
  const [amount, setamount] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [message, setMessage] = useState("");

  const transferToken = async () => {
    setisLoading(true);
    const token = await tokenCall(provider, tokenAddress as string);
    if (recipient.length >= 30 && parseInt(amount) >= 1) {
      const transferAmount: number = parseInt(amount) * 10 ** 18;
      const transferToken = await token.transfer(
        recipient,
        BigInt(transferAmount)
      );
      await transferToken.wait();
      setMessage(
        `Token have been transferred successfully to address: ${recipient}`
      );
    }
    setisLoading(false);
  };

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
              onClick={transferToken}
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
        </div>
      </div>
    </>
  );
};

export default Dashboard;
