import React from "react";
import { CheckboxFieldProps, useField } from "@packages/forms";
import FieldWrap from "../../FieldWrap";

const CheckboxField = (checkboxProps: CheckboxFieldProps) => {
  const { value, change, name, register } = useField<CheckboxFieldProps>({});

  return (
    <FieldWrap {...checkboxProps} className="checkbox-field">
      <input
        type="checkbox"
        id={`${name}.label`}
        checked={value}
        className="checkbox-field__input"
        onChange={(e) => change(e.target.checked)}
      />
    </FieldWrap>
  );
};

export default CheckboxField;
