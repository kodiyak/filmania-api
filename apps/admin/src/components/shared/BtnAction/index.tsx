import { Button, ButtonProps } from "@chakra-ui/react";
import React, { useState } from "react";

const BtnAction: React.FC<ButtonProps & { onAction: () => Promise<void> }> = ({
  onAction,
  ...rest
}) => {
  const [isLoading, setLoading] = useState(false);
  const onClick = async () => {
    setLoading(() => true);

    try {
      await onAction();
    } catch (error) {
      console.log("error", error);
    }

    setLoading(() => false);
  };

  return (
    <Button
      {...rest}
      isLoading={isLoading}
      variant={"ghost"}
      onClick={async (e) => {
        rest.onClick?.(e);

        return onClick();
      }}
    />
  );
};

export default BtnAction;
