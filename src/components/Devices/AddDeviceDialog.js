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
import useAxios from "axios-hooks";
import { vendorDomain, teamControl, typeDomain } from "../../config/config";

const createUrlApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_CREATE_URL;

const AddDeviceDialog = (props) => {
  const cancelRef = React.useRef();
  const toast = useToast();

  const { isOpen, onOpen, onClose } = props;

  const [name, setName] = useState();
  const [url, setUrl] = useState();

  useEffect(() => {}, []);

  const [value, setValue] = useState();

  const clickAddButton = async () => {
    let linkData = {
      name: name,
      url: url,
    };

    let data = await axiosPost(createUrlApi, linkData);
    if (data?.data?.code == 0) {
      toast({
        title: "Thành Công",
        // description: "We've created your account for you.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Thất Bại",
        // description: "We've created your account for you.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }

    fetchData();

    onClose();
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
          <AlertDialogHeader>Thêm Link</AlertDialogHeader>
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
                onClose();
              }}
            >
              Thêm
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AddDeviceDialog;
