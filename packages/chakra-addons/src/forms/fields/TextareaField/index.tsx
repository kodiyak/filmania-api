import React from "react";
import { Textarea } from "@chakra-ui/react";
import { TextareaFieldProps, useField } from "@packages/forms";
import FieldWrap from "../../FieldWrap";

const TextField: React.FC<TextareaFieldProps> = (field) => {
  const { value, change, name } = useField<TextareaFieldProps>({
    defaultValue: "",
  });
  return (
    <FieldWrap {...field}>
      <Textarea
        name={name}
        value={value}
        onChange={(e) => change(e.target.value)}
      />
    </FieldWrap>
  );
};

export default TextField;
