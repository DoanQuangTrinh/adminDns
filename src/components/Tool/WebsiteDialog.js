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
} from "@chakra-ui/react";

import { axiosPost } from "../../utils/api";

const addRankSiteApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_RANK_ADD_SITE;

const addExternalSiteApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_EXTERNAL_ADD_SITE;

const WebsiteDialog = ({ isOpen, onOpen, onClose, data }) => {
  const cancelRef = React.useRef();
  const [website, setWebsite] = useState();

  const clickAddButton = async () => {
    let name = data?.name;
    let websiteData = {
      name: name,
      site: website,
    };

    if (name == "Rank Google") {
      await axiosPost(addRankSiteApi, websiteData);
      alert(res);
    } else if (name == "External Link") {
      await axiosPost(addExternalSiteApi, websiteData);
    } else {
      console.log("======= name =======> ", name);
    }
    onClose();
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
          <AlertDialogHeader>Thêm Website Cho Tool</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <FormControl>
              <FormLabel>Website</FormLabel>
              <Input
                type="text"
                placeholder="Website"
                // value={key}
                onChange={(event) => setWebsite(event.target.value)}
              />
            </FormControl>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Huỷ
            </Button>
            <Button colorScheme="red" ml={3} onClick={() => clickAddButton()}>
              Thêm
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default WebsiteDialog;
