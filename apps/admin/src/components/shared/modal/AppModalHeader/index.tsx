import { ModalHeader, ModalHeaderProps } from "@chakra-ui/react";
import React from "react";

const AppModalHeader: React.FC<ModalHeaderProps> = (props) => {
  return (
    <ModalHeader
      {...props}
      borderBottomWidth={1}
      roundedTop={"md"}
      _dark={{ bg: "gray.900", borderColor: "gray.600", ...props?._dark }}
    />
  );
};

export default AppModalHeader;
