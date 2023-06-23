import React, { useMemo } from "react";
import { Field } from "../components/common/Field";
import { CreateFormProps, FieldProps, FormProps } from "../contracts";
import TestField from "../components/common/TestField";
import { FormProvider, UseFormReturn } from "react-hook-form";

const RenderField: React.FC<{ render: () => React.ReactNode }> = ({
  render,
}) => {
  const Component = render();
  return <>{Component}</>;
};

export interface NewFormProps {
  fields: FieldProps[];
  form: any;
  onSubmit: (data: any) => Promise<any>;
  children?: React.ReactNode;
}

const CreateForm: React.FC<
  CreateFormProps &
    FormProps & { form: UseFormReturn; onSubmit: (data: any) => Promise<any> }
> = ({ renderFields, fields, children, form, onSubmit }) => {
  return (
    <form className="flex flex-col" onSubmit={form.handleSubmit(onSubmit)}>
      <FormProvider {...form}>
        {fields.map((field, f) => (
          <Field {...field} key={`field.${field.name}.${f}`}>
            <RenderField
              render={() => renderFields[field.type](field as any)}
            />
            {/* <TestField {...field} /> */}
          </Field>
        ))}
        {children}
      </FormProvider>
    </form>
  );
};

export { CreateForm };
