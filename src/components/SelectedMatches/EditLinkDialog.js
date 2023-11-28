import React, { useState, useEffect, useMemo } from "react";

import {
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
  Avatar,
  useToast,
} from "@chakra-ui/react";

import { axiosPost } from "../../utils/api";
import { STATUS } from "utils/constant";

import { LINK_REGEX } from "utils/constant";
import { ROOT_API } from "utils/constant";
import { API_ROUTES } from "utils/constant";

const createKolApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_CREATE_KOL;

const updateKolApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_UPDATE_KOL;

const EditLinkDialog = ({ isOpen, onOpen, onClose, fetchData, data, matchId }) => {
  const cancelRef = React.useRef();

  const [link, setLink] = useState("");
  const [linkBackup, setLinkBackup] = useState("");
  const toast = useToast();

  useEffect(() => {
    if (data?.link) {
      setLink(data.link);
      setLinkBackup(data.linkBackup);
    }
  }, [data?.link]);

  const clickUpdateButton = async () => {
    const linkData = {
      link,
      linkBackup,
      linkId: data._id,
    };
    try {
      const response = await axiosPost(
        ROOT_API + API_ROUTES.UPDATE_LINK_LIVE + "/" + matchId,
        linkData
      );
      if (response?.data?.code == 0) {
        toast({
          title: data ? "Update Link Successfully" : "Create Link Successfully",
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
          (data ? "Update Link Fail" : "Create Link Fail"),
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
        size="xl"
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Edit Link Livestream</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <FormControl>
              <FormLabel>Link Livestream</FormLabel>
              <Input
                type="text"
                placeholder="Link"
                value={link}
                onChange={(event) => setLink(event.target.value)}
              />
            </FormControl>
            <FormControl mt={3}>
              <FormLabel>Link Backup</FormLabel>
              <Input
                type="text"
                placeholder="Link Backup"
                value={linkBackup}
                onChange={(event) => setLinkBackup(event.target.value)}
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
              onClick={() => clickUpdateButton()}
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
