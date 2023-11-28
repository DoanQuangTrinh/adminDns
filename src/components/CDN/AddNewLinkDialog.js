import React, { useState, useEffect } from "react";

import {
  Select,
  Button,
  Input,
  Checkbox,
  FormLabel,
  FormControl,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Avatar,
  useToast,
} from "@chakra-ui/react";

import { axiosPost } from "../../utils/api";

const createCdnLinkApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_CDN_ADD_NEW_CDN_LINK;

const AddNewLinkDialog = ({ isOpen, onOpen, onClose, fetchData }) => {
  const cancelRef = React.useRef();
  const [link, setLink] = useState();
  const toast = useToast();

  const clickUpdateButton = async () => {
    const linkData = {
      link,
    };

    try {
      const response = await axiosPost(createCdnLinkApi, linkData);
      if (response?.data?.code == 0) {
        toast({
          title: "Add Link Successfully",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        setLink("");
        fetchData();
        onClose();
      }
    } catch (error) {
      toast({
        title:
          error?.response?.data?.errors?.errors[0]?.msg ||
          error?.response?.data?.msg ||
          "Add Link Fail",
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
          <AlertDialogHeader>Add New CDN Link</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <FormControl mb={3}>
              <FormLabel>Link</FormLabel>
              <Input
                type="text"
                placeholder="Link"
                value={link}
                onChange={(event) => setLink(event.target.value)}
              />
            </FormControl>
            {/* <FormControl>
              <FormLabel>Link Backup</FormLabel>
              <Input
                type="text"
                placeholder="Link backup"
                value={linkBackup}
                onChange={(event) => setLinkBackup(event.target.value)}
              />
            </FormControl> */}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={() => {
                onClose();
                setLink("");
              }}
            >
              Cancel
            </Button>
            <Button
              colorScheme="red"
              ml={3}
              onClick={() => clickUpdateButton()}
              disabled={!link}
            >
              Add New
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AddNewLinkDialog;
