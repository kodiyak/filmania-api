import React, { createContext, useContext } from "react";
import { FieldProps } from "@packages/forms";

interface FieldContextProps {
  field: FieldProps;
}

const FieldContext = createContext({} as FieldContextProps);

export const Field: React.FC<FieldProps & { children: React.ReactNode }> = ({
  children,
  ...field
}) => {
  return (
    <FieldContext.Provider value={{ field }}>{children}</FieldContext.Provider>
  );
};

export function useFieldContext<T extends FieldProps = FieldProps>() {
  return useContext(FieldContext) as {
    field: T;
  };
}
