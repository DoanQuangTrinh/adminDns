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

const updateLinkApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_MEMBER_UPDATE_LINK;

const EditLinkDialog = (props) => {
  const cancelRef = React.useRef();
  const toast = useToast();

  const { isOpen, onOpen, onClose, data, fetchData } = props;

  const [name, setName] = useState();
  const [url, setUrl] = useState();

  useEffect(() => {
    if (data) {
      setName(data?.link?.name);
      setUrl(data?.link?.url)
    }
  }, [data]);

  const clickUpdateButton = async () => {

    const linkData = {
      name: name,
      link: url,
      idLink: data?.link._id
    };
    try {
      const data = await axiosPost(updateLinkApi, linkData, true);
      if (data?.data?.code == 0) {
        toast({
          title: "Update Link Successfully",
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
          "Update Link Fail",
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
          <AlertDialogHeader>Edit Link</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <FormControl mb={2}>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                placeholder="Video Name"
                onChange={(event) => setName(event.target.value)}
                value={name}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Url</FormLabel>
              <Input
                type="url"
                placeholder="youtube.com"
                onChange={(event) => setUrl(event.target.value)}
                value={url}
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
                clickUpdateButton();
              }}
            >
              Update
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EditLinkDialog;
