import React, { useEffect, useState } from "react";
import _ from "lodash";
import "../../styles/Global.css";
import "./Settings.css";
import { useAppSelector } from "state/hooks";
import { useAppDispatch } from "state/hooks";
import { Button, Image, Input } from "@chakra-ui/react";
import { ReactComponent as XpPoints } from "../../assets/images/settings-page/5-xp-points-color.svg";
import { AiOutlineClose } from "react-icons/ai";
import IconButton from "UIpack/IconButton";

const DisableXpPointDailog = (props) => {
    const dispatch = useAppDispatch();
    return (
        <>
            <div id="AddNewMemberComponent">
                <div onClick={()=>{props.setShowDisableDailog(false)
                props.setIsXpPointEnable(true); props.isXpPointSetByDailog(true)}} id="AddNewMemberOverlay"></div>
                <div id="AddNewMember">
                <div className="closeButtonArea">
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
              height={37}
              width={37}
              className="sideModalCloseButton"
              onClick={() => {
                props.setShowDisableDailog(false)
                props.setIsXpPointEnable(true)
                props.isXpPointSetByDailog(true)
                // toggleModal();
                // toggleXp();
              }}
            />
          </div>
                    <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <XpPoints style={{marginTop: "10px", marginBottom:'10px', width: "94.48px", height: "50px",color: "#C94B32" }} />
            {/* <Image
              src={XpPoints}
              alt="SWEAT Points icon"
              style={{ marginTop: "100px", width: "94.48px", height: "50px" }}
            /> */}
            <div id="title-type">Disable SWEAT Points</div>
          </div>

          {/* //! BODY */}
          <div id="cm-info" >
          You will no more be able to send SWEAT points and the current SWEAT points
            accumulated by members will be reset to zero.
          </div>
                {/* //! FOOTER */}
                <div className="button-section">
                    <Button
                    variant="outline"
                    mr={3}
                    onClick={() => {
                        // toggleModal();
                        // toggleXp();
                        props.setShowDisableDailog(false)
                        props.setIsXpPointEnable(true)
                        props.isXpPointSetByDailog(true)
                    }}
                    >
                    NO
                    </Button>
                    <Button id="button-save" onClick={() => { 
                      props.setShowDisableDailog(false)
                      props.setIsXpPointEnable(false)
                      props.isXpPointSetByDailog(true)
                     }}>YES</Button>
                </div>
                </div>
            </div>
        </>
    );
};

export default DisableXpPointDailog;
