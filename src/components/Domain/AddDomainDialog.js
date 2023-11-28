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
  useToast,
} from "@chakra-ui/react";

import { axiosPost } from "../../utils/api";
import { vendorDomain } from "config/config";
import { teamControl } from "config/config";
import { typeDomain } from "config/config";
// const vendorDomain = [
//   { value: "vendor1", color: "blue" },
//   { value: "vendor2", color: "green" },
//   // ... các giá trị khác
// ];

const createDomainApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_CREATE_DOMAIN;

const AddDomainDialog = ({ isOpen, onOpen, onClose }) => {
  const cancelRef = React.useRef();
  const [name, setName] = useState();
  const [url, setUrl] = useState();
  const toast = useToast();

  useEffect(() => {}, []);

  const [value, setValue] = useState();

  const clickAddButton = async () => {
    let domainData = {
      name: name,
      url: url,
    };

    let data = await axiosPost(createDomainApi, domainData);
    if (data.code == 0) {
      // alert("Thêm domain thành công");
      // onclick();

    } else {
      // alert("Thêm domain thất bại");
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
          <AlertDialogHeader>Thông Tin Domain</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <FormControl>
              <FormLabel>Domain Name</FormLabel>
              <Input
                type="text"
                placeholder="domainxxx.com"
                onChange={(event) => setDomain(event.target.value)}
              />
            </FormControl>
            <FormControl>
            <FormLabel>IP</FormLabel>
            <Input
                type="text"
                placeholder="100.000.000.000"
                onChange={(event) => setDomain(event.target.value)}
              />
            </FormControl>

            {/* <FormControl>
              <FormLabel>Nhà Cung Cấp</FormLabel>
              <Select
                onChange={(e) => {
                  setVendor(e.target.value);
                }}
              >
                {vendorDomain.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    colorScheme={option.color}
                  >
                    {option.value}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Team</FormLabel>
              <Select
                onChange={(e) => {
                  setTeam(e.target.value);
                }}
              >
                {teamControl.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.value}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Type</FormLabel>
              <Select
                onChange={(e) => {
                  setType(e.target.value);
                }}
              >
                {typeDomain.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.value}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>IP Server</FormLabel>
              <Input
                type="text"
                placeholder="Server"
                onChange={(event) => setIpServer(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Expired Date</FormLabel>
              <Input
                placeholder="Select Date and Time"
                size="md"
                type="datetime-local"
                onChange={(event) => {
                  console.log("======> " + event.target.value);
                  setExpired(event.target.value);
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel>NameServer</FormLabel>
              <Input
                type="text"
                placeholder="Name Server 1"
                onChange={(event) => setNameserver1(event.target.value)}
              />
              <Input
                type="text"
                placeholder="Name Server 2"
                onChange={(event) => setNameserver2(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Admin Site</FormLabel>
              <Input
                type="text"
                placeholder="Admin Url"
                onChange={(event) => setAdminUrl(event.target.value)}
              />
              <Input
                type="text"
                placeholder="Admin User"
                onChange={(event) => setAdminUser(event.target.value)}
              />
              <Input
                type="text"
                placeholder="Admin Pass"
                onChange={(event) => setAdminPass(event.target.value)}
              />
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

export default AddDomainDialog;
