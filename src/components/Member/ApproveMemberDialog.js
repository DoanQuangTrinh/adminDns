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

const approveMemberApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_APRROVE_MEMBER;

const ApproveMemberDialog = (props) => {
  const cancelRef = React.useRef();
  const toast = useToast();
  const textColor = useColorModeValue("gray.500", "white");

  const { isOpen, onOpen, onClose, fetchData, userName } = props;

  const clickApproveButton = async () => {
    const memberData = {
      userName,
    };
    try {
      const data = await axiosPost(approveMemberApi, memberData);
      if (data?.data?.code == 0) {
        toast({
          title: "Approved Member Successfully",
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
          "Approved Member Fail",
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
          <AlertDialogHeader>Approve Member</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <Flex>
              <Text fontSize="md" color={textColor} fontWeight="bold">
                Are you sure approve this member ?
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
                clickApproveButton();
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

export default ApproveMemberDialog;
