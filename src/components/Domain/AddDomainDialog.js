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

// import { axiosPost } from "../../utils/api";
import { vendorDomain } from "config/config";
import { teamControl } from "config/config";
import { typeDomain } from "config/config";
import Domain from "views/Dashboard/Domain/Domain";
import { axiosPost } from "../../utils/api";
import { useDataContext } from "context/UserContext";

const createDomainApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_CREATE_DOMAIN;
console.log(createDomainApi);
const AddDomainDialog = (props) => {
  const {onClose, isOpen,zone_id,_id,userDetail, logo, email, phone, role, status, date, isLast, refetch,ApiKey } = props;
  const cancelRef = React.useRef();
  const [name, setName] = useState("");
  const [ip, setIp] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [zoneId, setZoneId] = useState("");
  const toast = useToast();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isMounted, setIsMounted] = useState(true);
  const { domain, refetchDomainData } = useDataContext();

  const [value, setValue] = useState();
  const clickAddButton = async () => {
    
    const requestBody = {
              api_key: apiKey,
              name: name,
              ip: ip,
              zone_id: zoneId,
            };
    try{
      const response = await axiosPost (
        createDomainApi,
        requestBody
      )
      if (response.data.code === 0) {
        toast({
          title: "Create Domain Successfully",
          status: "success",
          duration: 9000,
        })
        refetchDomainData();
      } else {
        toast({
          title: "Create Domain Error ",
          status: "error",
          duration: 9000,
        })
      }
    }
    catch (err){
      console.log(err)
    }
  }
  

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
              <FormLabel>Api Key</FormLabel>
              <Input
                type="text"
                placeholder="Enter API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </FormControl>
            <FormControl>
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
            </FormControl>
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
                // refetch();
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