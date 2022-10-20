import React from "react";
import { Input, FormControl, FormErrorMessage } from "@chakra-ui/react";
import { InputFieldType } from "types/UItype";

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
        onClick={props.onClick}
        onBlur={props.onBlur}
        disabled={props.disabled}
        onKeyDown={props.onKeyDown}
        type={props.type}
        bg="#F5F5F5"
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
