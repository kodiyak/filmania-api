import { Box, BoxProps } from "@chakra-ui/react";
import React from "react";

const Col: React.FC<BoxProps> = ({ ...rest }) => {
  return <Box display={"flex"} flexDir={"column"} {...rest} />;
};

export default Col;
