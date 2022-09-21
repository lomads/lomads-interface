import React from "react";
import { Input, FormControl, FormErrorMessage } from "@chakra-ui/react";
import { InputFieldType } from "types/UItype";
import { ethers } from "ethers";

const AddressInputField = (props: InputFieldType) => {
  const isAddressValid = (holderAddress: string) => {
    const isValid: boolean = ethers.utils.isAddress(holderAddress);
    return isValid;
  };
  return (
    <FormControl isInvalid={props.isInvalid}>
      <Input
        id={props.id}
        className={props.className}
        style={{ height: props.height, width: props.width }}
        name={props.name}
        value={props.value}
        placeholder={props.placeholder}
        onChange={props.onchange}
      />
      {props.isInvalid && (
        <FormErrorMessage style={{ marginTop: 0, fontSize: "x-small" }}>
          {!isAddressValid(props.value as string) ? props.isInvalid : null}
        </FormErrorMessage>
      )}
    </FormControl>
  );
};

export default AddressInputField;
