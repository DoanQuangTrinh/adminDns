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

const DomainDialog = ({ isOpen, onOpen, onClose, data }) => {
  const cancelRef = React.useRef();
  const {
    domain,
    vendor,
    type,
    team,
    expired,
    ipServer,
    adminUrl,
    adminUser,
    adminPass,
    nameserver1,
    nameserver2,
    active,
    date,
    isLast,
  } = data;

  useEffect(() => {
    console.log('======data======> ' + domain);
  }, [domain]);


  const [value, setValue] = useState();

  const clickAddButton = async () => {

    // console.log("update domain detail");
    // await axiosPost(addRankSiteApi, {
    //   site: keys,
    // });
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
          <AlertDialogHeader>Thông Tin Domain</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <FormControl>
              <FormLabel>Domain Name</FormLabel>
              <Input
                type="text"
                placeholder="Từ Khoá"
                value={domain}
                // onChange={(event) => setValue(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Domain Name  : {vendor}</FormLabel>
            </FormControl>
            <FormControl>
              <FormLabel>Team Name : {team}</FormLabel>
            </FormControl>
            <FormControl>
              <FormLabel>IP Server : {ipServer}</FormLabel>
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

export default DomainDialog;
