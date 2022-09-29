import React, { useState, useRef, useEffect } from "react";
import _ from "lodash";
import { useNavigate, useLocation } from "react-router-dom";
import SimpleButton from "UIpack/SimpleButton";
import SimpleInputField from "UIpack/SimpleInputField";
import "../../styles/Global.css";
import "../../styles/pages/NameDAO.css";
import { useAppSelector } from "state/hooks";
import { useAppDispatch } from "state/hooks";
import { setDAOList } from 'state/dashboard/reducer';
import { updateDaoAddress, updateDaoName } from "state/flow/reducer";
import { LeapFrog } from "@uiball/loaders";
import axiosHttp from '../../api'

const NameDAO = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [DAOListLoading, setDAOListLoading] = useState<boolean>(location.pathname.indexOf('namedao') > -1 ? true : false);
  const [errors, setErrors] = useState<any>({});
  const refSafeName = useRef<string>("");
  const daoName = useAppSelector((state) => state.flow.daoName);
  const daoAddress = useAppSelector((state) => state.flow.daoAddress);
  const { DAOList } = useAppSelector((state) => state.dashboard);
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
      handleNavigate();
    } else {
      setErrors(terrors);
    }
  };

  useEffect(() => {
    if(location.pathname.indexOf('namedao') > -1) {
      if(DAOList.length == 0) {
        setDAOListLoading(true)
        axiosHttp.get("dao").then(res => { 
          setDAOList(res.data) 
          if(res.data.length > 0)
            navigate(`/${_.get(res.data, '[0].url')}`)
        })
        .finally(() => setDAOListLoading(false))
      }
    }
  }, [DAOList])

  const handleNavigate = () => {
    console.log("esfsffsf");
    daoName.length >= 1 && navigate("/invitegang");
  };
  const handleDaoName = (event: any) => {
    refSafeName.current = event.target.value.replace(/[^a-z0-9 ]/gi, "");
    dispatch(updateDaoName(refSafeName.current.toString()));
    dispatch(
      updateDaoAddress(
        "https://app.lomads.xyz/" +
          refSafeName.current.replace(/ /g, "-").toLowerCase()
      )
    );
  };


  return (
    <>
      { DAOListLoading ? 
      <div style={{ height: '100vh', zIndex: 99999, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LeapFrog size={50} color="#C94B32" />
      </div> :
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
            className="button"
            title="CREATE PUBLIC ADDRESS"
            height={50}
            fontsize={20}
            fontweight={400}
            onClick={handleClick}
            bgColor={daoName.length >= 1 ? "#C94B32" : "rgba(27, 43, 65, 0.2)"}
          />
        </div>
      </div>
      }
    </>
  );
};

export default NameDAO;
