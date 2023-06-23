import React from "react";
import { CreateForm, NewFormProps } from "@packages/forms";
import CheckboxField from "../fields/CheckboxField";
import SelectField from "../fields/SelectField";
import TextareaField from "../fields/TextareaField";
import TextField from "../fields/TextField";

const Form: React.FC<NewFormProps> = ({ fields, form, onSubmit, children }) => {
  return (
    <CreateForm
      renderFields={{
        text: TextField,
        select: SelectField,
        checkbox: CheckboxField,
        textarea: TextareaField,
      }}
      fields={fields}
      form={form}
      onSubmit={onSubmit}
    >
      {children}
    </CreateForm>
  );
};

export { Form };
