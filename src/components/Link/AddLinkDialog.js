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
} from "@chakra-ui/react";

import { axiosPost } from "../../utils/api";

const createUrlApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_CREATE_URL;

const addLinkApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_MEMBER_ADD_LINK;

const AddLinkDialog = (props) => {
  const cancelRef = React.useRef();
  const toast = useToast();

  const { isOpen, onOpen, onClose, isAddLink = false } = props;

  const [name, setName] = useState();
  const [url, setUrl] = useState();

  const clickAddButton = async () => {
    let linkData = {
      name: name,
      // url,
    };

    if (isAddLink) {
      linkData = {
        ...linkData,
        link,
      };
    } else {
      linkData = {
        ...linkData,
        url,
      };
    }
    try {
      const response = await axiosPost(
        isAddLink ? addLinkApi : createUrlApi,
        linkData,
        isAddLink
      );
      if (response?.data?.code == 0) {
        toast({
          title: "Add Link Successfully",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        fetchData();
        onClose();
      }
    } catch (error) {
      toast({
        title: error?.response?.data?.errors?.errors[0]?.msg || error?.response?.data?.msg || "Add Link Fail",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const fetchData = () => {
    props.fetchData();
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
          <AlertDialogHeader>Add Link</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                placeholder="Video Name"
                onChange={(event) => setName(event.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Url</FormLabel>
              <Input
                type="url"
                placeholder="youtube.com"
                onChange={(event) => setUrl(event.target.value)}
              />
            </FormControl>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              ml={3}
              onClick={() => {
                clickAddButton();
                // onClose();
              }}
            >
              Add
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AddLinkDialog;
