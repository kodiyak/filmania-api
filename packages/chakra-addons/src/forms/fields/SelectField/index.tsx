import React from "react";
import { Select } from "@chakra-ui/react";
import { SelectFieldProps, useField } from "@packages/forms";
import FieldWrap from "../../FieldWrap";

const TextField: React.FC<SelectFieldProps> = (selectProps) => {
  const { value, change, name } = useField<SelectFieldProps>({
    defaultValue: "",
  });
  return (
    <FieldWrap {...selectProps}>
      <Select
        name={name}
        value={value}
        onChange={(e) => change(e.target.value)}
      >
        <option value="">Selecionar...</option>
        {selectProps.options.map((option, i) => (
          <option key={`option.${i}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </FieldWrap>
  );
};

export default TextField;
