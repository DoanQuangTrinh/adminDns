import React, { useState, useEffect, useMemo } from "react";

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
  useToast,
} from "@chakra-ui/react";

import { axiosPost } from "../../utils/api";
import { STATUS } from "utils/constant";
import { get } from "lodash";
import { EMAIL_REGEX } from "utils/constant";
import { PHONE_REGEX } from "utils/constant";

const createKolApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_CREATE_KOL;

const updateKolApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_UPDATE_KOL;

const KolRegisterDialog = ({ isOpen, onOpen, onClose, fetchData, data }) => {
  const cancelRef = React.useRef();
  const fileInput = React.useRef(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState();
  const [status, setStatus] = useState(STATUS.PENDING);
  const [avatarPreview, setAvatarPreview] = useState();
  const toast = useToast();

  const kolStatus = useMemo(() => {
    return Object.keys(STATUS);
  }, []);

  useEffect(() => {
    if (data) {
      setName(data.name);
      setEmail(data.email);
      setPhone(data.phone);
      setStatus(data.status);
      setAvatarPreview(data.avatar);
    }
  }, [data]);
  const clickUpdateButton = async () => {
    if (!email.match(EMAIL_REGEX)) {
      toast({
        title: "Email sai định dạng",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    if (!phone.match(PHONE_REGEX)) {
      toast({
        title: "Phone sai định dạng",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    const kolData = new FormData();
    kolData.append("name", name);
    kolData.append("email", email);
    kolData.append("phone", phone);
    kolData.append("image", avatar);
    kolData.append("status", status);
    // const kolData = {
    //   name,
    //   image: avatar,
    // };
    if (data) {
      kolData.kol_id = data.id;
      kolData.append("kol_id", data.id);
    }
    const headers = {
      "content-type": "multipart/form-data",
    };
    try {
      const response = await axiosPost(
        data ? updateKolApi : createKolApi,
        kolData,
        headers
      );
      if (response?.data?.code == 0) {
        toast({
          title: data ? "Update Kol Successfully" : "Create Kol Successfully",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        fetchData();
        onClose();
        setName('');
        setPhone('');
        setEmail('');
        setAvatar(null)
      }
    } catch (error) {
      toast({
        title:
          error?.response?.data?.errors?.errors[0]?.msg ||
          error?.response?.data?.msg ||
          (data ? "Update Kol Fail" : "Create Kol Fail"),
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };
  const onChangeAvatar = () => {
    const btn = fileInput?.current;
    if (btn !== null) {
      btn.click();
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
          <AlertDialogHeader>ĐĂNG KÝ KOL</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <FormControl>
              <FormLabel>
                Avatar (Click below image to upload the avatar )
              </FormLabel>
              <Avatar
                src={avatarPreview}
                w="100px"
                h="100px"
                borderRadius="12px"
                me="18px"
                mb={3}
                onClick={onChangeAvatar}
              />
              <Input
                hidden
                type="file"
                ref={fileInput}
                onChange={(event) => {
                  setAvatar(event.target.files[0]);
                  const image = URL.createObjectURL(event.target.files[0]);
                  setAvatarPreview(image);
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Phone</FormLabel>
              <Input
                type="text"
                placeholder="Phone"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Status</FormLabel>
              <Select
              value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                }}
              >
                {kolStatus.map((st) => (
                  <option key={st} value={get(STATUS, st)}>
                    {get(STATUS, st)}
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
              disabled={(!data && !avatar) || !name || !email || !phone}
            >
              Update
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default KolRegisterDialog;
