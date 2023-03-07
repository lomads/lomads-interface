import React, { useState } from "react";
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";

import rightArrow from "../../assets/svg/rightArrow.svg";
import { ChangeComponentType } from "../../types";
import { useAppSelector, useAppDispatch } from "state/hooks";
import {
  updateVoteDurDay,
  updateVoteDurHour,
  updateSupport,
  updateMinApproval,
} from "state/proposal/reducer";

const ChangeComponent = (props: ChangeComponentType) => {
  const dispatch = useAppDispatch();
  const [value1, setValue1] = useState(props.value1);
  const [value2, setValue2] = useState(props.value2);

  const handleChange1 = (val: string) => {
    setValue1(parseInt(val));
    switch (props.property) {
      case "Support":
        dispatch(updateSupport(parseInt(val)));
        break;
      case "Min Approval":
        dispatch(updateMinApproval(parseInt(val)));
        break;
      case "Days":
      case "Vote Duration":
        dispatch(updateVoteDurDay(parseInt(val)));
        break;
      case "Hours":
        dispatch(updateVoteDurHour(parseInt(val)));
        break;
    }
  };

  const handleChange2 = (val: string) => {
    setValue2(parseInt(val));
    dispatch(updateVoteDurHour(parseInt(val)));
  };

  return (
    <>
      <div className="changebutton" style={{ minWidth: props.page ? 350 : 0 }}>
        <div className="property">{props.property}</div>
        <div className="flex 0 0" style={{ height: "60px" }}>
          <NumberInput
            variant="filled"
            height="100%"
            width={100}
            min={0}
            value={value1}
            onChange={(val) => handleChange1(val)}
          >
            <NumberInputField height="100%" borderRadius={5} />
            <NumberInputStepper
              style={{ background: "white", borderColor: "white" }}
            >
              <NumberIncrementStepper>
                <div>
                  <img src={rightArrow} alt="" className="rightarrowup" />
                </div>
              </NumberIncrementStepper>
              <NumberDecrementStepper>
                <div>
                  <img src={rightArrow} alt="" className="rightarrowdown" />
                </div>
              </NumberDecrementStepper>
            </NumberInputStepper>
          </NumberInput>
          {props.vote && (
            <NumberInput
              variant="filled"
              height="100%"
              width={100}
              min={0}
              value={value2}
              onChange={(val) => handleChange2(val)}
            >
              <NumberInputField height="100%" borderRadius={5} />
              <NumberInputStepper style={{ background: "white" }}>
                <NumberIncrementStepper>
                  <div>
                    <img src={rightArrow} alt="" className="rightarrowup" />
                  </div>
                </NumberIncrementStepper>
                <NumberDecrementStepper>
                  <div>
                    <img src={rightArrow} alt="" className="rightarrowdown" />
                  </div>
                </NumberDecrementStepper>
              </NumberInputStepper>
            </NumberInput>
          )}
        </div>
      </div>
    </>
  );
};

export default ChangeComponent;
