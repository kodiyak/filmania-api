import React from "react";
import { TextFieldProps, useField } from "@packages/forms";
import FieldWrap from "./../../FieldWrap";

const TextField = (textField: TextFieldProps) => {
  const { value, change, name } = useField<TextFieldProps>({
    defaultValue: "",
  });

  return (
    <FieldWrap {...textField} className="text-field">
      <input
        id={`${name}.label`}
        className="text-field__input"
        value={value}
        onChange={(e) => change(e.target.value)}
      />
    </FieldWrap>
  );
};

export default TextField;
