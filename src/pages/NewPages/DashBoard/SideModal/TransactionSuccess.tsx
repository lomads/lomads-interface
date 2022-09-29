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
          The transaction is now submited for voting.
          <br />
          You will be redirected in a few seconds.
        </div>
      </div>
    </>
  );
};

export default TransactionSuccess;
