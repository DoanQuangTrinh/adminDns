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
import { defautlPassword } from "utils/constant";

const resetPasswordApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_RESET_PASS_USER;

const UserResetPasswordDialog = (props) => {
  const cancelRef = React.useRef();
  const toast = useToast();
  const textColor = useColorModeValue("gray.500", "white");

  const { isOpen, onOpen, onClose, fetchData, userName, id } = props;

  const clickApproveResetPasswordButton = async () => {
    const memberData = {
      id : id,
    };
    try {
      const data = await axiosPost(resetPasswordApi, memberData);
      if (data?.data?.code == 0) {
        toast({
          title: "Reset Password User Successfully",
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
          "Reset Password User Fail",
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
          <AlertDialogHeader>Reset Password User</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <Flex flexDirection={'column'}>
              <Text fontSize="md" color={textColor} fontWeight="bold">
                {`Are you sure reset password for user ?`}
              </Text>
              <Text fontSize="md" color={textColor} fontWeight="bold">
                {`The password default is: ${defautlPassword}`}
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
                clickApproveResetPasswordButton();
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

export default UserResetPasswordDialog;
