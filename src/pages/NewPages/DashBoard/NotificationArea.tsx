import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import IconButton from "UIpack/IconButton";
import sendreceive from "../../../assets/svg/sendreceive.svg";

const NotificationArea = (props: any) => {
  return (
    <>
      <div className="notificationsArea">
        <div className="notification">
          <div id="notificationHeader">
            <div>
              <img src={sendreceive} alt="sendreceive" />
            </div>
            <div id="notificationTextButtonGrp">
              <div>
                <IconButton
                  Icon={
                    <AiOutlineClose
                      style={{
                        color: "#C94B32",
                        height: "16px",
                        width: "16px",
                      }}
                    />
                  }
                  bgColor="linear-gradient(180deg, #FBF4F2 0%, #EEF1F5 100%)"
                  height={25}
                  width={25}
                  className="sideModalCloseButton"
                />
              </div>
            </div>
          </div>
          <div id="notificationMainText">{`${props.pendingTransactionCount} transactions`}</div>
        </div>
      </div>
    </>
  );
};

export default NotificationArea;
