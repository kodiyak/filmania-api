import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import theme from "../../../configs/theme";

const ThemeProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
};

export default ThemeProvider;
