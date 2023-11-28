import React, { useState, useEffect } from "react";

import {
  Select,
  Button,
  Input,
  FormLabel,
  FormControl,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  useToast,
  useColorModeValue,
  Flex,
  Text,
} from "@chakra-ui/react";

import { axiosPost } from "../../utils/api";

const changeStatusCodeApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_UPDATE_COUNTRY_CODES;

const ChangeStatusDialog = (props) => {
  const cancelRef = React.useRef();
  const toast = useToast();
  const textColor = useColorModeValue("gray.500", "white");

  const { isOpen, onOpen, onClose, fetchData, name } = props;

  const clickChangeStatusButton = async () => {
    const codeData = {
      name,
    }
    try {
      const data = await axiosPost(changeStatusCodeApi, codeData);
      if (data?.data?.code == 0) {
        toast({
          title: "Change Status Code Successfully",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        fetchData();
        onClose();
      }
    } catch (error) {
      toast({
        title:
          error?.response?.data?.errors?.errors[0]?.msg ||
          error?.response?.data?.msg ||
          "Change Status Code Fail",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Change Status Code</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <Flex>
              <Text fontSize="md" color={textColor} fontWeight="bold">
                Are you sure change status this code ?
              </Text>
            </Flex>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              ml={3}
              onClick={() => {
                clickChangeStatusButton();
              }}
            >
              OK
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ChangeStatusDialog;
