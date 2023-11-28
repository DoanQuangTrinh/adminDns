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
} from "@chakra-ui/react";

import { axiosPost } from "../../utils/api";
import { ROOT_API } from "utils/constant";
import { API_ROUTES } from "utils/constant";


const EditLeagueDialog = (props) => {
  const cancelRef = React.useRef();
  const toast = useToast();
  const textColor = useColorModeValue("gray.500", "white");

  const { isOpen, onOpen, onClose, fetchData, name, leagueId } = props;
  const [league, setLeague] = useState({
    name: "",
  });
  useEffect(() => {
    if (name) {
      setLeague({
        ...league,
        name: name
      })
    }
  }, [name]);

  const clickSaveLeague = async () => {
    const leagueData = {
      name: league.name,
      leagueId
    }
    try {
      const data = await axiosPost(
        ROOT_API + API_ROUTES.CREATE_LEAGUE,
        leagueData
      );
      if (data?.data?.code == 0) {
        toast({
          title: "Update League Successfully",
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
          "Update League Fail",
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
          <AlertDialogHeader>Edit League</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                placeholder="Name"
                value={league.name}
                onChange={(event) =>
                  setLeague({
                    ...league,
                    name: event.target.value,
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
                clickSaveLeague();
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

export default EditLeagueDialog;
