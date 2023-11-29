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
// const vendorDomain = [
//   { value: "vendor1", color: "blue" },
//   { value: "vendor2", color: "green" },
//   // ... các giá trị khác
// ];

const createDomainApi ='http://localhost:8080/api/v1/domain/';

const AddDomainDialog = ({ isOpen, onOpen, onClose }) => {
  const cancelRef = React.useRef();
  const [name, setName] = useState("");
  const [ip, setIp] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [zoneId, setZoneId] = useState("");
  const toast = useToast();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isMounted, setIsMounted] = useState(true);
  useEffect(() => {
    return () => {
      // Component sẽ unmount, set isMounted thành false
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {}, []);

  const [value, setValue] = useState();

  const clickAddButton = async () => {
    // let domainData = {
    //   apiKey: apiKey,
    //   name: name,
    //   ip:ip,
    //   zoneId:zoneId
    // };
    // console.log(domainData);
  //   try {
  //     let data = await axiosPost(createDomainApi, domainData, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'xToken': 'wOPo5PsL0Ft+RCgUqEVCTQ==',
  //       },
  //     });
  //     console.log('API Response:', data);
  //     if (data.code === 0) {
  //       toast({
  //         title: "Thêm domain thành công",
  //         status: "success",
  //       });
  //       onclick();
  //     } else {
  //       toast({
  //         title: "Thêm domain thất bại",
  //         status: "error",
  //       });
  //     }
  //   } catch (error) {
  //     console.error('API Error:', error);
  //     toast({
  //       title: "Có lỗi xảy ra khi gửi yêu cầu",
  //       status: "error",
  //     });
  //   }
  
  //   onClose();
  // };
  try {
    const response = await axios.post(
      "http://localhost:8080/api/v1/domain/",
      {
        name,
        ip,
        api_key: apiKey,
        zone_id: zoneId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "xToken" : "wOPo5PsL0Ft+RCgUqEVCTQ=="
          // Add any additional headers if needed
        },
      }
    );
    console.log(response.data); 
    if (response.data.code === 0) {
      toast({
        title: "Create Domain Success",
        status: "success",
      });
      fetchData();
    } else {
      toast({
        title: "Failed to create domain",
        status: "error",
      });
    }
  } catch (error) {
    console.error("API Error:", error);
    toast({
      title: "Error creating domain",
      status: "error",
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
