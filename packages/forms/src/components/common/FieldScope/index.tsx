import React from "react";
import FormNamespace, { useFormNamespace } from "../contexts/FormNamespace";

const FieldScope: React.FC<{
  namespace: string;
  children?: React.ReactNode;
}> = ({ children, namespace }) => {
  const { namespaces } = useFormNamespace();

  if (!namespaces) {
    return <FormNamespace initialData={[namespace]}>{children}</FormNamespace>;
  }

  return (
    <FormNamespace initialData={[...namespaces, namespace]}>
      {children}
    </FormNamespace>
  );
};

export default FieldScope;
