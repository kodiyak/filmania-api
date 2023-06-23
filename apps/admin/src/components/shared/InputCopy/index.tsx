import { Button, Input, useClipboard } from "@chakra-ui/react";
import React from "react";
import Row from "../Row";

const InputCopy: React.FC<ReturnType<typeof useClipboard>> = ({
  hasCopied,
  onCopy,
  setValue,
  value,
}) => {
  return (
    <>
      <Row pos={"relative"} alignItems={"center"} gap={2}>
        <Input
          value={value}
          readOnly
          rounded={"sm"}
          variant={"filled"}
          size={"sm"}
        />
        <Button
          size={"sm"}
          right={0}
          onClick={onCopy}
          zIndex={20}
          colorScheme={hasCopied ? "green" : "gray"}
          variant={"ghost"}
        >
          {hasCopied ? "Copiado" : "Copiar"}
        </Button>
      </Row>
    </>
  );
};

export default InputCopy;
