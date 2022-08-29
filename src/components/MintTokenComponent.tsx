import React, { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { useAppSelector } from "state/hooks";
import { tokenCall } from "connection/DaoTokenCall";
import { LeapFrog } from "@uiball/loaders";

const MintTokenComponent = () => {
  const { provider } = useWeb3React();
  const [isLoading, setisLoading] = useState(false);
  const [message, setMessage] = useState("");

  const tokenAddress = useAppSelector(
    (state) => state.proposal.deployedTokenAddress
  );
  const tokenSupply = useAppSelector((state) => state.proposal.supply);
  const holder = useAppSelector((state) => state.proposal.holder);

  const mintToken = async () => {
    setisLoading(true);
    const supply = tokenSupply;
    const token = await tokenCall(provider, tokenAddress as string);
    const mintToken = await token.mint(holder, supply);
    await mintToken.wait();
    setMessage("Token have been minted successfully");
    setisLoading(false);
  };
  return (
    <div className={"TitleBar"} style={{ paddingBottom: 60 }}>
      <div className={"tokentitleTile"} style={{ width: 750 }}>
        <div>
          <div className={"tileItemHeader"}>
            <div>Mint token</div>
          </div>
          <div className="flex flex-row justify-start items-center">
            <input
              className={"inputField"}
              type="title"
              name="title"
              value={tokenSupply}
              style={{ height: 40, width: 340 }}
              autoFocus
              placeholder="Enter Amount"
            />
            <button
              id="buttonDeploy"
              className={"nextButton"}
              style={{
                background: "#C94B32",
                position: "relative",
                left: "10px",
                marginBottom: "40px",
              }}
              onClick={mintToken}
            >
              Mint
            </button>
            <div style={{ marginLeft: 20 }}>
              {isLoading ? <LeapFrog size={35} color="#C94B32" /> : null}
            </div>
          </div>
          <div className={"message"} style={{ width: "486px" }}>
            {message}
          </div>
        </div>
        {/* second */}
      </div>
    </div>
  );
};

export default MintTokenComponent;
