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

const toggleMatchApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_MATCH_TOGGLE_MATCH;

const SelectedMatchDialog = (props) => {
  const cancelRef = React.useRef();
  const toast = useToast();
  const textColor = useColorModeValue("gray.500", "white");

  const { isOpen, onOpen, onClose, fetchData, idMatch, time} = props;

  const clickChooseMatchButton = async () => {
    const dataMatch = {
      time
    }
    try {
      const data = await axiosPost(toggleMatchApi + idMatch, dataMatch);
      if (data?.data?.code == 0 || data?.status === 200) {
        toast({
          title: "Choose Match Successfully",
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
          "Choose Match Fail",
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
          <AlertDialogHeader>Choose Match</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <Flex>
              <Text fontSize="md" color={textColor} fontWeight="bold">
                Are you sure choose this match ?
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
                clickChooseMatchButton();
              }}
            >
              Choose
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SelectedMatchDialog;
