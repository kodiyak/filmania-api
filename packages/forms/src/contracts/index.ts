import { UseFormProps } from "react-hook-form";

type BaseFieldProps<T> = {
  name: string;
  label?: string;
  description?: string;
  defaultValue?: T;
  readOnly?: boolean;
};

export type FieldProps =
  | TextFieldProps
  | TextareaFieldProps
  | CheckboxFieldProps
  | SelectFieldProps;

export interface TextFieldProps extends BaseFieldProps<string> {
  type: "text";
}

export interface TextareaFieldProps extends BaseFieldProps<string> {
  type: "textarea";
}

export interface CheckboxFieldProps extends BaseFieldProps<boolean> {
  type: "checkbox";
}

export interface SelectFieldProps extends BaseFieldProps<string> {
  type: "select";
  options: OptionProps[];
}

export interface OptionProps {
  label: string;
  value: string;
}

export type FormWrapProps = FieldProps & {
  className?: string;
  children?: React.ReactNode;
};

type FormProviderRenderField<T> = (props: T) => React.ReactNode;

export interface FormProps {
  fields: FieldProps[];
  children?: React.ReactNode;
}

export type CreateFormProps = {
  renderFields: {
    text: FormProviderRenderField<TextFieldProps>;
    select: FormProviderRenderField<SelectFieldProps>;
    checkbox: FormProviderRenderField<CheckboxFieldProps>;
    textarea: FormProviderRenderField<TextareaFieldProps>;
  };
};
