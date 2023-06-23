import React from "react";
import FieldWrap from "../../FieldWrap";
import { SelectFieldProps, useField } from "@packages/forms";

const SelectField = (selectProps: SelectFieldProps) => {
  const { value, change, name } = useField<SelectFieldProps>({
    defaultValue: "",
  });
  return (
    <FieldWrap {...selectProps} className="select-field">
      <select
        id={`${name}.label`}
        className="select-field__select"
        value={value}
        onChange={(e) => {
          change(e.target.value);
        }}
      >
        <option value="">Selecione...</option>
        {selectProps.options.map((option, i) => (
          <option key={`option.${i}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldWrap>
  );
};

export default SelectField;
