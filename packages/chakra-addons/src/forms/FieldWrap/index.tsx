import { Flex, FormControl, FormLabel } from "@chakra-ui/react";
import React from "react";
import { FormWrapProps } from "@packages/forms";

const FieldWrap: React.FC<FormWrapProps> = ({ label, children }) => {
  return (
    <Flex flexDir={"column"}>
      <FormControl>
        <FormLabel>{label}</FormLabel>
        {children}
      </FormControl>
    </Flex>
  );
};

export default FieldWrap;
