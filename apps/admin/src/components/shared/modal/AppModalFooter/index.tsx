import { ModalFooter, ModalFooterProps } from "@chakra-ui/react";
import React from "react";

const AppModalFooter: React.FC<ModalFooterProps> = (props) => {
  return (
    <ModalFooter
      {...props}
      borderTopWidth={1}
      roundedBottom={"md"}
      _dark={{ bg: "gray.900", borderColor: "gray.600", ...props?._dark }}
    />
  );
};

export default AppModalFooter;
