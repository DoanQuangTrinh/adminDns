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
import { propertyCatagory, statusCatagory } from "../../config/config";

const createPropertyApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_CREATE_PROPERTY;

const AddPropertyDialog = ({ isOpen, onOpen, onClose }) => {
  const cancelRef = React.useRef();

  const [propertyId, setPropertyId] = useState();
  const [propertyName, setPropertyName] = useState();
  const [category, setCategory] = useState();
  const [status, setStatus] = useState();

  // useEffect(() => {
  //   propertyCatagory.map((item) => {
  //     console.log("======data======> " + item.value);
  //   });
  // }, [propertyCatagory]);

  const [value, setValue] = useState();

  const clickAddButton = async () => {
    let propertyData = {
      propertyId: propertyId,
      propertyName: propertyName,
      Category: category,
      status: status,
    };

    await axiosPost(createPropertyApi, propertyData);
    // if (data.code == 0) {
    //   alert("Thêm domain thành công");
    // } else {
    //   alert("Thêm domain thất bại");
    // }

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
          <AlertDialogHeader>Add Property</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <FormControl>
              <FormLabel>Property ID</FormLabel>
              <Input
                type="text"
                placeholder="Property ID"
                onChange={(event) => setPropertyId(event.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Property Name</FormLabel>
              
              <Input
                type="text"
                placeholder="Property Name"
                onChange={(event) => setPropertyName(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Category</FormLabel>
              <Select
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
              >
                {propertyCatagory.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.value}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Status</FormLabel>
              <Select
                onChange={(e) => {
                  setStatus(e.target.value);
                }}
              >
                {statusCatagory.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.value}
                  </option>
                ))}
              </Select>
            </FormControl>
            

            {/* <FormControl>
              <FormLabel>Domain Name : {vendor}</FormLabel>
            </FormControl>
            <FormControl>
              <FormLabel>Team Name : {team}</FormLabel>
            </FormControl>
            <FormControl>
              <FormLabel>IP Server : {ipServer}</FormLabel>
            </FormControl> */}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            {/* onClick={() => clickAddButton()} */}
            <Button colorScheme="red" ml={3} onClick={() => clickAddButton()}>
              Thêm
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AddPropertyDialog;
