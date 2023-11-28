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
  Avatar,
} from "@chakra-ui/react";

import { axiosPost } from "../../utils/api";
import { ROOT_API } from "utils/constant";
import { API_ROUTES } from "utils/constant";


const EditTeamDialog = (props) => {
  const cancelRef = React.useRef();
  const toast = useToast();
  const textColor = useColorModeValue("gray.500", "white");
  const fileInput = React.useRef(null);

  const {
    isOpen,
    onOpen,
    onClose,
    fetchData,
    teamData,
    teamId,
  } = props;
  const [team, setTeam] = useState({
    name: "",
    description: "",
  });
  const [avatarPreview, setAvatarPreview] = useState();

  useEffect(() => {
    if (teamData) {
      setTeam({
        ...team,
        name: teamData.name,
        description: teamData.description,
      });
      setAvatarPreview(ROOT_API + teamData.logoUrl);
    }
  }, [teamData]);

  const clickSaveTeam = async () => {
    if (!team?.name?.trim()) {
      toast({
        title: "Team name is require",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    const teamData = {
      name: team.name,
      id: teamId,
    };
    try {
      const data = await axiosPost(
        ROOT_API + API_ROUTES.UPDATE_TEAM,
        teamData
      );
      if (data?.data?.code == 0) {
        toast({
          title: "Update Team Successfully",
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
          "Update Team Fail",
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
          <AlertDialogHeader>Edit Team</AlertDialogHeader>
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
                value={team.name}
                onChange={(event) =>
                  setTeam({
                    ...team,
                    name: event.target.value,
                  })
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input
                type="text"
                placeholder="Description"
                value={team.description}
                onChange={(event) =>
                  setTeam({
                    ...team,
                    description: event.target.value,
                  })
                }
              />
            </FormControl>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
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

export default EditTeamDialog;
