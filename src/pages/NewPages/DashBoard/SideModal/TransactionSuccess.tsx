import React from "react";
import doubleEuro from "../../../../assets/svg/doubleEuro.svg";

const TransactionSuccess = () => {
  return (
    <>
      <div id="transactionSuccessPage">
        <div>
          <img src={doubleEuro} alt="euro" id="doubleEuro" />
        </div>
        <div className="transactionDetails">Success!</div>
        <div className="dashboardText">
          Your transaction is now submitted for signing by other members, if applicable
        </div>
      </div>
    </>
  );
};

export default TransactionSuccess;
