import { IconButton, Square, useColorMode } from "@chakra-ui/react";
import React from "react";

const ToggleThemeButton: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <IconButton aria-label="Toggle Theme" onClick={toggleColorMode}>
      <Square>{colorMode === "dark" ? "🌞" : "🌚"}</Square>
    </IconButton>
  );
};

export default ToggleThemeButton;
