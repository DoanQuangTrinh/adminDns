import React, { useState, useEffect } from "react";
import axios from "axios";
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

const CreateSubDomain =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_API_CREATE_SUBDOMAIN;
console.log(CreateSubDomain);
const AddSubDomain = ({ isOpen, onOpen, onClose }) => {
  const cancelRef = React.useRef();
  const [id, setId] = useState("");
  const toast = useToast();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isMounted, setIsMounted] = useState(true);
  useEffect(() => {
    return () => {
      setIsMounted(false);
    };
  }, []);
  const [subDomains, setSubDomains] = useState([]);
  useEffect(() => {}, []);

  const [value, setValue] = useState();
  const xToken = localStorage.getItem('xToken');
  const clickAddButton = async () => {
    window.location.reload();
  try {
    const response = await axios.post(
      CreateSubDomain,
      {
        domain_id:id,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "xToken" : xToken
        },
      }
    );
    console.log(response.data.data); 
    if (response.data.code === 0) {
        setSuccess("SubDomain added successfully!");
        
      // toast({
      //   // title: "Create Domain Success",
      //   // status: "success",
      // });
    //   fetchData();
    } else {
      // toast({
      //   // title: "Failed to create domain",
      //   // status: "error",
      // });
    }
  } catch (error) {
    console.error("API Error:", error);
    // toast({
    //   title: "Error creating domain",
    //   status: "error",
    // });
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
          <AlertDialogHeader>Thông Tin SubDomain</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <FormControl>
              <FormLabel>SubDomain ID</FormLabel>
              <Input
                type="text"
                placeholder="Enter SubDomain ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
            </FormControl>
            {/* <FormControl>
            <FormLabel>Name</FormLabel>
            <Input
                type="text"
                placeholder="Enter domain name"
                value={name}
                onChange={(e) => setName(e.target.value)}
        />
            </FormControl>
            <FormControl>
            <FormLabel>IP</FormLabel>
            <Input
          type="text"
          placeholder="Enter IP address"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
        />
            </FormControl>
            <FormControl>
            <FormLabel>Zone ID</FormLabel>
            <Input
              type="text"
              placeholder="Enter Zone ID"
              value={zoneId}
              onChange={(e) => setZoneId(e.target.value)}
            />
            </FormControl> */}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
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

export default AddSubDomain;
