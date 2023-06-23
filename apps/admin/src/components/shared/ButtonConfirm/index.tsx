import {
  Box,
  Button,
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  SimpleGrid,
  Tooltip,
  Text,
  CloseButton,
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";

interface ButtonConfirmProps {
  isDisabled?: boolean;
  variants: {
    [key: string]: {
      colorScheme: string;
      label: string;
      icon: React.ReactNode;
    };
  };
  initial: string;
  confirm: string;
  title?: string;
  message?: string;
  onConfirm: () => Promise<void>;
  closeOnConfirm?: boolean;
}

const ButtonConfirm: React.FC<ButtonConfirmProps> = ({
  variants,
  initial,
  confirm,
  onConfirm,
  isDisabled,
  title,
  message,
  closeOnConfirm,
}) => {
  const [currentVariant, setVariant] = useState(initial);
  const [isLoading, setLoading] = useState(false);
  const variant = useMemo(() => {
    return variants[currentVariant];
  }, [variants, currentVariant]);

  const onClickButton = async () => {
    if (currentVariant === initial) {
      setVariant(() => confirm);
    }
  };

  const onConfirmButtonClick = async () => {
    setLoading(() => true);
    await onConfirm();
    if (closeOnConfirm) {
      setVariant(() => initial);
    }

    setLoading(() => false);
  };

  const onCancelButtonClick = async () => {
    setVariant(() => initial);
  };

  const Btn: React.FC = () => {
    return (
      <>
        <IconButton
          onClick={() => {
            // console.log("Delete");
            onClickButton();
          }}
          isLoading={isLoading}
          variant={"ghost"}
          isDisabled={isDisabled}
          colorScheme={variant.colorScheme}
          aria-label={variant.label}
        >
          {variant.icon}
        </IconButton>
      </>
    );
  };

  if (currentVariant === confirm) {
    return (
      <>
        <Popover
          isOpen={currentVariant === confirm}
          computePositionOnMount
          closeOnBlur
          closeOnEsc
        >
          <PopoverTrigger>
            <Box>
              <Btn />
            </Box>
          </PopoverTrigger>
          <PopoverContent
            bg={"white"}
            borderColor={`${variant.colorScheme}.600`}
            _dark={{
              borderColor: `${variant.colorScheme}.800`,
              bg: "gray.900",
            }}
          >
            {/* <PopoverArrow borderColor={`${variant.colorScheme}.500`} /> */}
            {/* <PopoverCloseButton colorScheme={variant.colorScheme} /> */}
            <CloseButton
              size={"sm"}
              pos={"absolute"}
              right={2}
              top={2}
              onClick={onCancelButtonClick}
            />
            {title && (
              <PopoverHeader
                fontWeight={"bold"}
                fontSize={"xs"}
                textTransform={"uppercase"}
                color={`${variant.colorScheme}.700`}
                _dark={{
                  color: `${variant.colorScheme}.500`,
                }}
                border={"none"}
                opacity={closeOnConfirm && isLoading ? 0.4 : 1}
              >
                {title}
              </PopoverHeader>
            )}
            {message && (
              <Box
                display={"flex"}
                flexDir={"column"}
                px={4}
                py={2}
                border={"none"}
                fontSize={"xs"}
                fontWeight={"bold"}
                color={"GrayText"}
                wordBreak={"break-word"}
                overflow={"auto"}
              >
                <Text wordBreak={"break-word"}>{message}</Text>
              </Box>
            )}
            <PopoverFooter
              roundedBottom={"md"}
              borderColor={"darken.50"}
              bg={"rgba(0,0,0,.02)"}
              _dark={{ bg: "darken.300" }}
            >
              <SimpleGrid gap={2} columns={2}>
                <Button
                  size={"xs"}
                  onClick={onCancelButtonClick}
                  isDisabled={isLoading}
                  // variant={"ghost"}
                  // colorScheme={"red"}
                >
                  Cancelar
                </Button>
                <Button
                  size={"xs"}
                  variant={"ghost"}
                  colorScheme={"green"}
                  onClick={onConfirmButtonClick}
                  isDisabled={isLoading}
                >
                  Confirmar
                </Button>
              </SimpleGrid>
            </PopoverFooter>
          </PopoverContent>
        </Popover>
      </>
    );
  }

  if (currentVariant === initial) {
    return (
      <>
        <Tooltip
          bg={`${variant.colorScheme}.400`}
          color={"white"}
          label={isDisabled ? undefined : variant.label}
        >
          <Box>
            <Btn />
          </Box>
        </Tooltip>
      </>
    );
  }

  return null;
};

export default ButtonConfirm;
