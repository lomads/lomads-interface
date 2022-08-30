import React, { useEffect } from "react";
import { Icon, IconButton } from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import "../../styles/CreateDao.css";
import optionalSelect from "../../assets/svg/optionalSelect.svg";
import rightArrow from "../../assets/svg/rightArrow.svg";
import { templateType } from "../../types";

const SelectTemplate = (props: templateType) => {
  return (
    <div className="template" style={{ background: props.bgColor }}>
      <div className="template-image">
        {/* <img src={optionalSelect} className="checkImage" alt="" /> */}
        <Icon
          color={props.iconColor}
          m={[2, 2]}
          w={46}
          h={46}
          as={FaCheckCircle}
          className="absolute"
        />
        {props.isCommingSoon ? (
          <button className="w-2/3 py-2 px-4 relative text-white bg-slate-600 top-0 left-0 right-0 bottom-0 m-auto z-50 rounded-lg">
            COMMING SOON
          </button>
        ) : null}
      </div>

      <div className="template-detail" style={{ background: props.bgColor }}>
        <div>
          <div className="title">{props.blockTitle}</div>
          <div className="description">{props.blockDescription}</div>
        </div>
        <div>
          <button className={"button1"}>
            <img src={rightArrow} alt="rightArrow" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectTemplate;
