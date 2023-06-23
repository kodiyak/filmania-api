import { ModalBody, ModalBodyProps } from "@chakra-ui/react";
import React from "react";

const AppModalBody: React.FC<ModalBodyProps> = (props) => {
  return <ModalBody {...props} p={0} _dark={{ bg: "gray.800" }} />;
};

export default AppModalBody;
