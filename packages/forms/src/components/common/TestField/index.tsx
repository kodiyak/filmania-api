import React from "react";
import { useFormContext } from "react-hook-form";
import { FieldProps } from "../../../contracts";

const TestField: React.FC<FieldProps> = () => {
  const form = useFormContext();
  console.log(form);

  return <>Test {JSON.stringify(!!form && Object.keys(form).length > 0)}</>;
};

export default TestField;
