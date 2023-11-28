import React, { useState, useEffect } from "react";

import {
  Button,
  Input,
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
  useColorModeValue,
  Select,
  Checkbox,
  Flex,
  Text,
  Avatar,
} from "@chakra-ui/react";

import { axiosPost } from "../../utils/api";
import { ROOT_API } from "utils/constant";
import { API_ROUTES } from "utils/constant";
import useAxios from "axios-hooks";

const CreateTeamDialog = (props) => {
  const { isOpen, onOpen, onClose, fetchData } = props;
  const fileInput = React.useRef(null);
  const cancelRef = React.useRef();
  const toast = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [avatarPreview, setAvatarPreview] = useState();
  const [avatar, setAvatar] = useState();

  const clickSaveTeam = async () => {
    if (!name.trim()) {
      toast({
        title: "Team name is require",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    const teamData = new FormData();
    teamData.append("name", name);
    teamData.append("description", description);
    teamData.append("logoFile", avatar);
    const headers = {
      "content-type": "multipart/form-data",
    };
    try {
      const data = await axiosPost(
        ROOT_API + API_ROUTES.CREATE_TEAM,
        teamData,
        headers
      );
      if (data?.data?.code == 0) {
        toast({
          title: "Create Team Successfully",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        fetchData();
        resetForm();
        onClose();
      }
    } catch (error) {
      toast({
        title:
          error?.response?.data?.errors?.errors[0]?.msg ||
          error?.response?.data?.msg ||
          "Create Team Fail",
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

  function resetForm () {
    setName("");
    setDescription("");
    setAvatarPreview("");
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
          <AlertDialogHeader>Create Team</AlertDialogHeader>
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
              <FormLabel>Name (*)</FormLabel>
              <Input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </FormControl>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={() => {
              onClose();
              resetForm();
            }}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              ml={3}
              onClick={() => {
                clickSaveTeam();
              }}
            >
              OK
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CreateTeamDialog;
