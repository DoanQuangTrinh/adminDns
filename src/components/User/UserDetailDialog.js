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

const updateDomainApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_UPDATE_DOMAIN;

const UserDetailDialog = ({ isOpen, onOpen, onClose }) => {
  const cancelRef = React.useRef();

  // Domain
  const [domain, setDomain] = useState();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [keywords, setKeywords] = useState();
  const [active, setActive] = useState(false);
  const [crawlType, setCrawlType] = useState(Number);

  const [selectedRows, setSelectedRows] = useState([
    { value: "dịch" },
    { value: "mix" },
    { value: "AI" },
    { value: "spin" },
  ]);

  useEffect(() => {
    // console.log("data", data);
    // setDomain(data?.domain);
    // setUsername(data?.username);
    // setPassword(data?.password);
    // setKeywords(data?.keywords);
    // setActive(data?.active);
    // setCrawlType(data?.crawlType === undefined ? 2 : data?.crawlType);
  }, []);

  const clickUpdateButton = async () => {
    console.log("update domain detail");
    await axiosPost(updateDomainApi, {
      id: data?._id,
      active: active,
      crawlType: crawlType,
      keywords: keywords,
    });
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
          <AlertDialogHeader>Cập nhập tên miền</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <Checkbox
              size="lg"
              colorScheme="orange"
              isChecked={active}
              onChange={(e) => setActive(e.target.checked)}
            >
              Active vào hệ thống tự động
            </Checkbox>
            <FormControl>
              <FormLabel>Domain</FormLabel>
              <Input
                type="text"
                placeholder="Domain"
                value={domain}
                onChange={(event) => setDomain(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Keyword</FormLabel>
              <FormControl
                as="textarea"
                rows="3"
                placeholder="Keyword"
                value={keywords !== undefined ? keywords : "Moái"}
                onChange={(event) => setKeywords(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Chọn cách tạo nội dung</FormLabel>
              <Select
                value={selectedRows[crawlType].value}
                onChange={(e) => {
                  setCrawlType(e.target.selectedIndex);
                }}
              >
                {selectedRows.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.value}
                  </option>
                ))}
              </Select>
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

export default UserDetailDialog;
