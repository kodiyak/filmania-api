import { Box, BoxProps } from "@chakra-ui/react";
import React from "react";

const Row: React.FC<BoxProps> = ({ ...rest }) => {
  return <Box display={"flex"} flexDir={"row"} {...rest} />;
};

export default Row;
