import React from "react";
import { Input } from "@chakra-ui/react";
import { TextFieldProps, useField } from "@packages/forms";
import FieldWrap from "../../FieldWrap";

const TextField: React.FC<TextFieldProps> = (field) => {
  const { value, change, name } = useField<TextFieldProps>({
    defaultValue: "",
  });
  return (
    <FieldWrap {...field}>
      <Input
        name={name}
        value={value}
        onChange={(e) => change(e.target.value)}
      />
    </FieldWrap>
  );
};

export default TextField;
