import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import _ from 'lodash';
import lomadsfulllogo from "../../assets/svg/lomadsfulllogo.svg";
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
const { debounce } = require('throttle-debounce');

const NameDAO = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [DAOListLoading, setDAOListLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>({});
  const [urlCheckLoading, setUrlCheckLoading] = useState<any>(false);
  const refSafeName = useRef<string>("");
  const daoName = useAppSelector((state) => state.flow.daoName);
  const daoAddress = useAppSelector((state) => state.flow.daoAddress);
  const { DAOList } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(updateDaoName(""))
    dispatch(updateDaoAddress(""))
  }, [])

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

  // useEffect(() => {
  //   if(location.pathname.indexOf('namedao') > -1) {
  //     if(DAOList.length == 0) {
  //       setDAOListLoading(true)
  //       axiosHttp.get("dao").then(res => { 
  //         setDAOList(res.data) 
  //         if(res.data.length > 0)
  //           navigate(`/${_.get(res.data, '[0].url')}`)
  //       })
  //       .finally(() => setDAOListLoading(false))
  //     }
  //   }
  // }, [DAOList])

  const checkAvailability = (e: any) => {
    if(e.target.value && e.target.value !== ""){
        setUrlCheckLoading(true)
        axiosHttp.get(`dao/${e.target.value.replace(/ /g, "-").toLowerCase()}`)
        .then(res => {
          if(!res.data){
            dispatch(updateDaoAddress(process.env.REACT_APP_URL + "/" + e.target.value.replace(/ /g, "-").toLowerCase()))
          } else {
            let rand = Math.floor(1000 + Math.random() * 9000);
            axiosHttp.get(`dao/${e.target.value.replace(/ /g, "-").toLowerCase() + '-' + rand}`)
            .then(result => {
              rand = Math.floor(1000 + Math.random() * 9000);
              dispatch(updateDaoAddress(process.env.REACT_APP_URL + "/" + e.target.value.replace(/ /g, "-").toLowerCase() + '-' + rand))
            })
            .catch(err => {
              dispatch(updateDaoAddress(process.env.REACT_APP_URL + "/" + e.target.value.replace(/ /g, "-").toLowerCase() + '-' + rand))
            })
          }
        })
        .catch(err => {
          dispatch(updateDaoAddress(process.env.REACT_APP_URL + "/" + e.target.value.replace(/ /g, "-").toLowerCase()))
        })
        .finally(() => setUrlCheckLoading(false))
    } else {
      dispatch(updateDaoAddress(""))
    }
 }

  const checkAvailabilityAsync = useRef(_.debounce(checkAvailability, 500)).current

  const handleNavigate = () => {
    console.log("esfsffsf");
    daoName.length >= 1 && navigate("/invitegang");
  };
  const handleDaoName = (event: any) => {
    refSafeName.current = event.target.value.replace(/[^a-z0-9 ]/gi, "");
    dispatch(updateDaoName(refSafeName.current.toString()));
  };

  return (
    <>
      { DAOListLoading ? 
        <div style={{ backgroundColor: '#FFF', height: '100vh', zIndex: 99999, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="logo">
          <img src={lomadsfulllogo} alt="" />
        </div>
        <LeapFrog size={50} color="#C94B32" />
      </div> : null
      }
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
                  checkAvailabilityAsync(event)
                  handleDaoName(event);
                }}
                isInvalid={errors.daoName}
              />
            </div>
            <div>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <div className="inputFieldTitle" style={{ marginRight: '16px' }}>DAO address</div>
                { urlCheckLoading && <LeapFrog size={20} color="#C94B32" /> }
              </div>
              <SimpleInputField
                className="inputField"
                height={50}
                width={460}
                disabled
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
            disabled={urlCheckLoading}
            fontweight={400}
            onClick={handleClick}
            bgColor={daoName.length >= 1 || !urlCheckLoading ? "#C94B32" : "rgba(27, 43, 65, 0.2)"}
          />
        </div>
      </div>
    </>
  );
};

export default NameDAO;
