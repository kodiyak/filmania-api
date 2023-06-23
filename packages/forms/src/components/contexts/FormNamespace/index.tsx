import React, { createContext, useContext, useState } from "react";

interface FormNamespaceContextProps {
  namespaces: string[];
  addNamespace: (name: string) => void;
}

const FormNamespaceContext = createContext({} as FormNamespaceContextProps);

const FormNamespace: React.FC<{
  children?: React.ReactNode;
  initialData?: string[];
}> = ({ children, initialData }) => {
  const [namespaces, setNamespaces] = useState<string[]>(initialData || []);

  const addNamespace = (name: string) => {
    setNamespaces((old) => [...old, name]);
  };

  return (
    <FormNamespaceContext.Provider
      value={{
        namespaces,
        addNamespace,
      }}
    >
      {children}
    </FormNamespaceContext.Provider>
  );
};

export const useFormNamespace = () => useContext(FormNamespaceContext);

export default FormNamespace;