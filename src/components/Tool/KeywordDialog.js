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
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_RANK_ADD_KEY;

const KeywordDialog = ({ isOpen, onOpen, onClose, data }) => {
  const cancelRef = React.useRef();

  const [value, setValue] = useState();

  const clickAddButton = async () => {
    let name = data?.name;
    let websiteData = {
      name: name,
      key: value,
    };

    await axiosPost(addRankSiteApi, websiteData);

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
          <AlertDialogHeader>Thêm Từ Khoá Cho Tool</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <FormControl>
              <FormLabel>Từ Khoá</FormLabel>
              <Input
                type="text"
                placeholder="Từ Khoá"
                onChange={(event) => setValue(event.target.value)}
              />
            </FormControl>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
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

export default KeywordDialog;
