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
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";

import { axiosPost } from "../../utils/api";
import { roleUser } from "config/config";
import useAxios from "axios-hooks";
import { defautlPassword } from "utils/constant";

const updateDomainApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_REGISTER_USER;

const updateUserApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_UPDATE_USER;

const groupApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_GROUPS;

const UserRegisterDialog = ({ isOpen, userDetail, onOpen, onClose, fetchData }) => {
  const cancelRef = React.useRef();
  const toast = useToast();

  const [username, setUsername] = useState();
  const [password, setPassword] = useState(defautlPassword);
  const [email, setEmail] = useState();
  const [show, setShow] = useState(false);
  const [phone, setPhone] = useState();
  const [active, setActive] = useState(false);
  const [role, setRole] = useState(roleUser[0].value);
  const [groupUser, setGroupUser] = useState([]);
  const [groupUserSelected, setGroupUserSelected] = useState();

  const [{ data }, refetch] = useAxios({
    url: groupApi
  });

  useEffect(() => {
    const groupUsers = [];
    {
      data?.groups?.map((member) => {
        groupUsers.push({ value: member.groupName })
      })
    }
    setGroupUser(groupUsers);
    if (groupUsers?.length) setGroupUserSelected(groupUsers[0].value);
  }, [
    data
  ]);
  useEffect(() => {
    if (userDetail) {
      setUsername(userDetail?.username)
      setEmail(userDetail?.email)
      setPhone(userDetail?.phone)
      setRole(userDetail?.role)
      setGroupUserSelected(userDetail?.group)
    }
  }, [userDetail])

  const clickUpdateButton = async () => {
    console.log("update user detail");

    if(userDetail) {
      let userData = {
        id: userDetail._id,
        email: email,
        phone: phone,
        role: role,
        group: role=== "user" ? groupUserSelected : null,
      };
      try {
        const response = await axiosPost(updateUserApi, userData);
        if (response?.data?.code == 0) {
          toast({
            title: "Update User Successfully",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          fetchData();
          onClose();
        }
      } catch (error) {
        console.log(error)
        toast({
          title:
            error?.response?.data?.errors?.errors[0]?.msg ||
            error?.response?.data?.msg || "Update Group Fail",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }else {
      let userData = {
        username: username,
        password: password,
        passwordConf: password,
        email: email,
        phone: phone,
        role: role,
        group: groupUserSelected,
      };
      try {
        const response = await axiosPost(updateDomainApi, userData);
        if (response?.data?.code == 0) {
          toast({
            title: "Create User Successfully",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          fetchData();
          onClose();
        }
      } catch (error) {
        console.log(error)
        toast({
          title:
            error?.response?.data?.errors?.errors[0]?.msg ||
            error?.response?.data?.msg || "Create Group Fail",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
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
          <AlertDialogHeader>ĐĂNG KÝ TÀI KHOẢN</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            {/* <Checkbox
              size="lg"
              colorScheme="orange"
              isChecked={active}
              onChange={(e) => setActive(e.target.checked)}
            >
              Active vào hệ thống tự động
            </Checkbox> */}

            {userDetail ? (
              <>
                <FormControl>
                  <FormLabel>Username</FormLabel>
                  <Input
                    type="text"
                    placeholder="Username"
                    disabled
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                  />
                </FormControl>
              </>
            ) : (
              <>
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
                  <InputGroup>
                    <Input
                      type={show ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      // onChange={(event) => setPassword(event.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={() =>
                          setShow(!show)
                        }
                      >
                        {show ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
              </>
            )}
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Phone</FormLabel>
              <Input
                type="phone"
                placeholder="Enter phone number"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Role User</FormLabel>
              <Select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                }}
              >
                {roleUser?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.value}
                  </option>
                ))}
              </Select>
            </FormControl>

            {role === "user" && (
              <FormControl>
                <FormLabel>Group User</FormLabel>
                <Select
                  value={groupUserSelected}
                  onChange={(e) => {
                    setGroupUserSelected(e.target.value);
                  }}
                >
                  {groupUser &&
                    groupUser?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.value}
                      </option>
                    ))}
                </Select>
              </FormControl>
            )}
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

export default UserRegisterDialog;