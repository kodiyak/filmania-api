import React from "react";
import FieldWrap from "../../FieldWrap";
import { TextareaFieldProps, useField } from "@packages/forms";

const TextareaField = (textField: TextareaFieldProps) => {
  const { value, change, name } = useField<TextareaFieldProps>({
    defaultValue: "",
  });

  return (
    <FieldWrap {...textField} className="textarea-field">
      <textarea
        id={`${name}.label`}
        className="textarea-field__textarea"
        value={value}
        onChange={(e) => change(e.target.value)}
      />
    </FieldWrap>
  );
};

export default TextareaField;
