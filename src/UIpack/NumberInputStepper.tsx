import React from "react";
import {
  Input,
  FormControl,
  FormErrorMessage,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberIncrementStepper,
} from "@chakra-ui/react";
import { InputFieldType } from "types/UItype";
import daoMember2 from "../assets/svg/daoMember2.svg";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

const SimpleInputField = (props: InputFieldType) => {
  return (
    <FormControl isInvalid={!props.value && props.isInvalid}>
      <NumberInput step={1} min={0}>
        <NumberInputField
          id={props.id}
          className={props.className}
          style={{ height: props.height, width: props.width }}
          name={props.name}
          value={props.value}
          placeholder={props.placeholder}
          onChange={props.onchange}
          type={props.type}
          bg="#F5F5F5"
        />
        {/* <NumberInputStepper>
          <NumberIncrementStepper color="#C94B32" />
          <NumberDecrementStepper color="#C94B32" />
        </NumberInputStepper> */}
      </NumberInput>
      {!props.value && props.isInvalid && (
        <FormErrorMessage style={{ marginTop: 0, fontSize: "x-small" }}>
          {props.isInvalid}
        </FormErrorMessage>
      )}
    </FormControl>
  );
};

export default SimpleInputField;
