import React, { useState } from "react";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import SimpleButton from "UIpack/SimpleButton";
import SimpleInputField from "UIpack/SimpleInputField";
import "../../styles/Global.css";
import "../../styles/pages/NameDAO.css";
import { useAppSelector } from "state/hooks";
import { useAppDispatch } from "state/hooks";
import { updateDaoAddress, updateDaoName } from "state/flow/reducer";

const NameDAO = () => {
  const dispatch = useAppDispatch();
  const [errors, setErrors] = useState<any>({});
  const daoName = useAppSelector((state) => state.flow.daoName);
  const daoAddress = useAppSelector((state) => state.flow.daoAddress);
  const navigate = useNavigate();
  const handleClick = () => {
    let terrors: any = {};
    if (!daoName) {
      terrors.daoName = " * DAO name is required.";
    }
    if (!daoAddress) {
      terrors.daoAddress = " * DAO Address is required.";
    }
    if (_.isEmpty(terrors)) {
      navigate("/invitegang");
    } else {
      setErrors(terrors);
    }
  };

  const handleDaoName = (event: any) => {
    dispatch(updateDaoName(event.target.value));
    dispatch(
      updateDaoAddress(
        "https://app.lomads.xyz/".concat(daoName).replace(/ /g, "-")
      )
    );
  };
  return (
    <>
      <div className="NameDAO">
        <div className="headerText">1/3 Name your new DAO</div>
        <div className="centerCard">
          <div>
            <div>
              <div className="inputFieldTitle">Name Your DAO</div>
              <SimpleInputField
                className="inputField"
                height={50}
                width={460}
                placeholder="Epic DAO"
                value={daoName}
                onchange={(event) => {
                  handleDaoName(event);
                }}
                isInvalid={errors.daoName}
              />
            </div>
            <div>
              <div className="inputFieldTitle">DAO address</div>
              <SimpleInputField
                className="inputField"
                height={50}
                width={460}
                value={daoAddress}
                placeholder="https://app.lomads.xyz/Name_of_the_DAO"
                onchange={(e) => {
                  dispatch(updateDaoAddress(e.target.value));
                }}
                isInvalid={errors.daoAddress}
              />
            </div>
          </div>
        </div>
        <div className="createName">
          <SimpleButton
            title="CREATE PUBLIC ADDRESS"
            height={50}
            fontsize={20}
            fontweight={400}
            onClick={handleClick}
            bgColor="#C94B32"
          />
        </div>
      </div>
    </>
  );
};

export default NameDAO;
