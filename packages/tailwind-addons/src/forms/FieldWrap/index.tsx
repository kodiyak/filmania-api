import React from "react";
import { FormWrapProps } from "@packages/forms";

const FieldWrap: React.FC<FormWrapProps> = ({
  name,
  type,
  children,
  defaultValue,
  description,
  label,
  readOnly,
  className,
}) => {
  const labelId = `${name}.label`;

  return (
    <div className={className}>
      <label htmlFor={`${labelId}`}>{label}</label>
      {children}
    </div>
  );
};

export default FieldWrap;
