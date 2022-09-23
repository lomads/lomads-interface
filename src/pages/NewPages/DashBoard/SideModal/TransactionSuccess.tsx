import React, { useEffect, useRef, useState } from "react";
import { Checkbox } from "@chakra-ui/react";
import { AiOutlineClose } from "react-icons/ai";
import IconButton from "UIpack/IconButton";
import SimpleButton from "UIpack/SimpleButton";
import doubleEuro from "../../../../assets/svg/doubleEuro.svg";
import daoMember2 from "../../../../assets/svg/daoMember2.svg";
import SafeButton from "UIpack/SafeButton";
import OutlineButton from "UIpack/OutlineButton";
import SimpleInputField from "UIpack/SimpleInputField";
import { ethers } from "ethers";
import { InviteGangType } from "types/UItype";
import { IselectTransactionSend, IsetRecipientType } from "types/DashBoardType";

const TransactionSuccess = () => {
  return (
    <>
      <div id="transactionSuccessPage">
        <div>
          <img src={doubleEuro} alt="euro" id="doubleEuro" />
        </div>
        <div className="transactionDetails">Success!</div>
        <div className="dashboardText">
          The transaction is now submited for voting.
          <br />
          You will be redirected in a few seconds.
        </div>
      </div>
    </>
  );
};

export default TransactionSuccess;
