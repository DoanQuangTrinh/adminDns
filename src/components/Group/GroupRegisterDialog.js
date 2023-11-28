import React, { useState, useEffect } from "react";
import { typeGroup } from "config/config";


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
  Avatar,
  Text,
  useToast,
} from "@chakra-ui/react";

import { axiosPost } from "../../utils/api";

const createGroupApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_CREATE_GROUPS;

const updateGroupApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_UPDATE_GROUPS;

const GroupRegisterDialog = ({
  isOpen,
  onOpen,
  onClose,
  fetchData,
  data
}) => {
  const cancelRef = React.useRef();
  const [type, setType] = useState(typeGroup[0]?.value);
  const [active, setActive] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [isShowAll, setShowAll] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [groupName, setGroupName] = useState();
  const toast = useToast();

  useEffect(() => {
    if (data) {
      setGroupName(data.groupName);
      setActive(data.isTrue);
      setIsShow(data.isShow);
      setShowAll(data.isShowAll);
      setIsCreate(data.isCreate);
      setIsUpdate(data.isUpdate);
      setIsDelete(data.isDelete);
    }
  }, [data])
  const clickUpdateButton = async () => {
    const groupData = {
      groupName,
      type,
      isTrue: active,
      isShow,
      isShowAll,
      isCreate,
      isUpdate,
      isDelete,
    };
    if (data) {
      groupData.id = data.id
    }
    const headers = {
      "content-type": "application/json",
    };
    try {
      const response = await axiosPost(data ? updateGroupApi : createGroupApi, groupData, headers);
      if (response?.data?.code == 0) {
        toast({
          title: data ? "Update Group Successfully" : "Create Group Successfully",
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
          (data ? "Update Group Fail" : "Create Group Fail"),
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
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>TẠO MỚI GROUP</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <FormControl>
              <FormLabel>Group Name</FormLabel>
              <Input
                type="text"
                placeholder="Group Name"
                value={groupName}
                onChange={(event) => setGroupName(event.target.value)}
              />
            </FormControl>
            <FormControl mt={2}>
              <FormLabel>Type Group</FormLabel>
              <Select
                onChange={(e) => {
                  setType(e.target.value);
                }}
              >
                {typeGroup.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.value}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl mt={2}>
              <FormLabel>Status</FormLabel>
              <Checkbox
                size="lg"
                colorScheme="orange"
                isChecked={active}
                onChange={(e) => setActive(e.target.checked)}
              >
                <Text fontSize="sm">Active</Text>
              </Checkbox>
            </FormControl>
            <FormControl mt={2}>
              <FormLabel>Permission</FormLabel>
              <Checkbox
                size="lg"
                colorScheme="orange"
                isChecked={isShow}
                onChange={(e) => setIsShow(e.target.checked)}
              >
                <Text fontSize="sm">Show</Text>
              </Checkbox>
            </FormControl>
            <FormControl>
              <Checkbox
                size="lg"
                colorScheme="orange"
                isChecked={isShowAll}
                onChange={(e) => setShowAll(e.target.checked)}
              >
                <Text fontSize="sm">Show All</Text>
              </Checkbox>
            </FormControl>
            <FormControl>
              <Checkbox
                size="lg"
                colorScheme="orange"
                isChecked={isCreate}
                onChange={(e) => setIsCreate(e.target.checked)}
              >
                <Text fontSize="sm">Create</Text>
              </Checkbox>
            </FormControl>
            <FormControl>
              <Checkbox
                size="lg"
                colorScheme="orange"
                isChecked={isUpdate}
                onChange={(e) => setIsUpdate(e.target.checked)}
              >
                <Text fontSize="sm">Update</Text>
              </Checkbox>
            </FormControl>
            <FormControl>
              <Checkbox
                size="lg"
                colorScheme="orange"
                isChecked={isDelete}
                onChange={(e) => setIsDelete(e.target.checked)}
              >
                <Text fontSize="sm">Delete</Text>
              </Checkbox>
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
              disabled={!groupName}
            >
              Update
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default GroupRegisterDialog;
