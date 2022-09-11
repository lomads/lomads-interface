import React from "react";
import { Input, FormControl, FormErrorMessage } from "@chakra-ui/react";
import { InputFieldType } from "types/UItype";
import { ethers } from "ethers";

const SimpleInputField = (props: InputFieldType) => {
  return (
    <FormControl isInvalid={!props.value && props.isInvalid}>
      <Input
        id={props.id}
        className={props.className}
        style={{ height: props.height, width: props.width }}
        name={props.name}
        value={props.value}
        placeholder={props.placeholder}
        onChange={props.onchange}
        type={props.type}
      />
      {!props.value && props.isInvalid && (
        <FormErrorMessage style={{ marginTop: 0, fontSize: "x-small" }}>
          {props.isInvalid}
        </FormErrorMessage>
      )}
    </FormControl>
  );
};

export default SimpleInputField;
