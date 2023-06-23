import React from "react";
import { Checkbox } from "@chakra-ui/react";
import { CheckboxFieldProps, useField } from "@packages/forms";
import FieldWrap from "../../FieldWrap";

const TextField: React.FC<CheckboxFieldProps> = (field) => {
  const { value, change, name } = useField<CheckboxFieldProps>({
    defaultValue: false,
  });
  return (
    <FieldWrap {...field}>
      <Checkbox
        name={name}
        checked={value}
        onChange={(e) => change(e.target.checked)}
      />
    </FieldWrap>
  );
};

export default TextField;
