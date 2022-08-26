import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import { FormControl, FormErrorMessage, Icon, Tooltip } from "@chakra-ui/react";
import SelectTemplate from "../components/sub/SelectTemplate";
import "../styles/App.css";
import "../styles/CreateDao.css";
import "../styles/Dashboard.css";
import "../styles/Modal.css";
import "../styles/Sidebar.css";
import ChangeComponent from "../components/sub/ChangeComponent";
import SliderThumbWithTooltip from "components/sub/SupportSlider";
import ApprovalSliderThumbWithTooltip from "components/sub/ApprovalSlider";
import Header from "components/Header";
import { useAppSelector, useAppDispatch } from "state/hooks";
import { updateTemplate, updateTemplateVal } from "state/proposal/reducer";
import { updateStepNumber } from "state/proposal/reducer";
import useStepRouter from "hooks/useStepRouter";

const SettingsPage = () => {
  useStepRouter(3);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const web3authAddress = useAppSelector(
    (state) => state.proposal.Web3AuthAddress
  );
  const template = useAppSelector((state) => state.proposal.template);
  const templateVal = useAppSelector((state) => state.proposal.templateVal);
  const voteDurDay = useAppSelector((state) => state.proposal.voteDurDay);
  const voteDurHour = useAppSelector((state) => state.proposal.voteDurHour);
  const minApproval = useAppSelector((state) => state.proposal.minApproval);
  const support = useAppSelector((state) => state.proposal.support);
  const [errors, setErrors] = useState<any>({});
  const showHeader = <Header />;

  useEffect(() => {
    if (!_.isEmpty(errors)) {
      const id = Object.keys(errors)[0];
      const element = document.getElementById(id);
      if (element) {
        element.focus();
        const rect = element.getBoundingClientRect();
        window.scrollTo({
          top: window.scrollY + rect.y - 60,
          behavior: "auto",
        });
      }
    }
  }, [errors]);
  const TEMPLATE = ["Collective", "Service Network", "Shared Owner"];

  // const handleTemplateSelect = (val: number) => {
  //   if (val === templateVal) {
  //     dispatch(updateTemplateVal(-1));
  //     dispatch(updateTemplate(""));
  //   } else {
  //     dispatch(updateTemplateVal(val));
  //     dispatch(updateTemplate(TEMPLATE[val]));
  //   }
  // };

  const handleClick = () => {
    let terrors: any = {};

    if (support <= 0) {
      terrors.support = "* Support is required.";
    }

    if (minApproval <= 0) {
      terrors.approval = "* Approval is required.";
    }
    if (_.isEmpty(terrors)) {
      dispatch(updateStepNumber(4));
      navigate("/token");
    } else {
      setErrors(terrors);
    }
  };

  return (
    <>
      <div className="absolute top-0 right-0">{showHeader}</div>
      <div
        className={"something"}
        style={{
          paddingLeft: 480,
          paddingTop: 100,
          paddingBottom: 100,
          height: 1600,
        }}
      >
        <div className={"pageTitle"}>Settings</div>
        <div className={"pageDescription"}>Choose your template and more</div>
        <div>
          <div className={"subItemHeader"}>
            <div>Select a Template</div>
            <div className={"rect2"}>
              <div className={"reqText"}>Comming Soon</div>
            </div>
          </div>
          <div className={"fieldDesc"}>
            Create your organisation with our pre-configured templates.
          </div>
          <div
            style={{
              display: "flex",
              position: "relative",
              right: 120,
              zIndex: 9999,
            }}
          >
            <SelectTemplate
              blockTitle={TEMPLATE[0]}
              blockDescription="Comming Soon"
              iconColor={"#b5b8ba"}
              bgColor={"#b5b8ba"}
              isCommingSoon={true}
              // onClick={() => handleTemplateSelect(0)}
            />
            <SelectTemplate
              blockTitle={TEMPLATE[1]}
              blockDescription="Comming soon"
              iconColor={"white"}
              bgColor={"#FFFFFF"}
              isCommingSoon={false}
              // onClick={() => handleTemplateSelect(1)}
            />
            <SelectTemplate
              blockTitle={TEMPLATE[2]}
              blockDescription="Comming Soon"
              iconColor={"#b5b8ba"}
              bgColor={"#b5b8ba"}
              isCommingSoon={true}
              // onClick={() => handleTemplateSelect(2)}
            />
          </div>
        </div>
        <div>
          <div className={"subItemHeader"}>
            <div>Voting</div>
            <div className={"rect2"}>
              <div className={"reqText"}>Required</div>
            </div>
          </div>
          <div className={"fieldDesc"}>
            Choose your voting application settings.
          </div>
          <div style={{ width: "500px" }}>
            <div className={"pageSubItemHeader"}>
              Support
              <Tooltip hasArrow label="Support" placement="top">
                <Icon color="gray" w={19} h={19} ml={5} name="question" />
              </Tooltip>
            </div>
            <FormControl isInvalid={!support && errors.support}>
              <SliderThumbWithTooltip />
              {!support && errors.support && (
                <FormErrorMessage style={{ marginTop: 0, fontSize: "x-small" }}>
                  {errors.support}
                </FormErrorMessage>
              )}
            </FormControl>
          </div>

          <div style={{ width: "486px" }}>
            <div className={"pageSubItemHeader"}>
              Minimum Approval
              <Tooltip hasArrow label="Minimum Approval" placement="top">
                <Icon color="gray" w={19} h={19} ml={5} name="question" />
              </Tooltip>
            </div>
            <FormControl isInvalid={!minApproval && errors.approval}>
              <ApprovalSliderThumbWithTooltip />
              {!minApproval && errors.approval && (
                <FormErrorMessage style={{ marginTop: 0, fontSize: "x-small" }}>
                  {errors.approval}
                </FormErrorMessage>
              )}
            </FormControl>
          </div>
          <div className={"pageSubItemHeader"}>
            Vote Duration
            <Tooltip hasArrow label="vote Duration" placement="top">
              <Icon color="gray" w={19} h={19} ml={5} name="question" />
            </Tooltip>
          </div>
          <div style={{ display: "flex" }}>
            <ChangeComponent property="Days" value1={voteDurDay} />
            <ChangeComponent property="Hours" value1={voteDurHour} />
          </div>
        </div>
        <div>
          <button
            id="nextButtonSettings"
            className={"nextButton"}
            onClick={handleClick}
          >
            NEXT STEP
          </button>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
