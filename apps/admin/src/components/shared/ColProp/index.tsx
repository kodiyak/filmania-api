import { Text } from "@chakra-ui/react";
import React from "react";
import Col from "../Col";

const ColProp: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => {
  return (
    <Col>
      <Text
        fontSize={"xs"}
        color={"GrayText"}
        _groupHover={{ color: "inherit" }}
      >
        {label}
      </Text>
      <Text fontSize={"sm"} fontWeight={"bold"} as={"div"}>
        {value}
      </Text>
    </Col>
  );
};

export default ColProp;
