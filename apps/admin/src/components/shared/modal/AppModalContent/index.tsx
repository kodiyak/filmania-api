import { ModalContent, ModalContentProps } from "@chakra-ui/react";
import React from "react";

const AppModalContent: React.FC<ModalContentProps> = (props) => {
  return (
    <ModalContent
      {...props}
      borderWidth={1}
      _dark={{ borderColor: "gray.700", ...props?._dark }}
    />
  );
};

export default AppModalContent;
