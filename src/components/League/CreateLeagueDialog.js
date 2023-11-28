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
} from "@chakra-ui/react";

import { axiosPost } from "../../utils/api";
import { ROOT_API } from "utils/constant";
import { API_ROUTES } from "utils/constant";
import useAxios from "axios-hooks";

const CreateLeagueDialog = (props) => {
  const { isOpen, onOpen, onClose, fetchData, name, leagueId } = props;
  const cancelRef = React.useRef();
  const toast = useToast();
  const [league, setLeague] = useState();
  const [country, setCountry] = useState();
  const [isActive, setIsActive] = useState(false);
  const [
    { data: dataCode, loading: loadingCode, error: errorCode },
    refetchCode,
  ] = useAxios(
    {
      url: ROOT_API + API_ROUTES.COUNTRIES,
    },
    {
      useCache: false,
    }
  );

  const [
    { data: dataLeague, loading: loadingLeague, error: errorLeague },
    refetchLeague,
  ] = useAxios({
    url: ROOT_API + API_ROUTES.LEAGUES_BY_COUNTRY,
    params: {
      country,
    },
  });

  const clickSaveLeague = async () => {
    if (!dataLeague?.data?.length) return
    const selectedLeague = dataLeague.data.find(
      (_league) => Number(_league.league.id) === Number(league)
    );
    if (!selectedLeague?.league?.id) return;
    // console.log(selectedLeague, "selectedLeague");
    // return;
    const leagueData = {
      name: selectedLeague.league.name,
      leagueId: selectedLeague.league.id,
      leagueLogo: selectedLeague.league.logo,
      isActive,
    };

    try {
      const data = await axiosPost(
        ROOT_API + API_ROUTES.CREATE_LEAGUE,
        leagueData
      );
      if (data?.data?.code == 0) {
        toast({
          title: "Create League Successfully",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        fetchData();
        onClose();
        setCountry("");
        setLeague(undefined);
        setIsActive(false);
      }
    } catch (error) {
      toast({
        title:
          error?.response?.data?.errors?.errors[0]?.msg ||
          error?.response?.data?.msg ||
          "Create League Fail",
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
          <AlertDialogHeader>Create League</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <FormControl mb={2}>
              <FormLabel>Country</FormLabel>
              <Select
                placeholder="Select Country"
                onChange={(e) => {
                  setCountry(e.target.value);
                }}
                value={country}
              >
                {dataCode?.data?.length
                  ? dataCode.data.map((code) => (
                      <option key={code._id} value={code.name} fontWeight={500}>
                        {code.name}
                      </option>
                    ))
                  : "No code"}
              </Select>
            </FormControl>
            <FormControl mb={2}>
              <FormLabel>League</FormLabel>
              <Select
                placeholder="Select League"
                onChange={(e) => setLeague(e.target.value)}
                value={league}
              >
                {dataLeague?.data?.length
                  ? dataLeague.data.map((league) => (
                      <option
                        key={league?.league?.id}
                        value={league.league.id}
                        fontWeight={500}
                      >
                        {league?.league?.name}
                      </option>
                    ))
                  : "No code"}
              </Select>
            </FormControl>
            <FormControl>
              <Flex flexDirection={"row"} alignItems={"center"} columnGap={2}>
                <Checkbox
                  value={isActive}
                  isChecked={isActive}
                  onChange={() => setIsActive(!isActive)}
                />
                <Text
                  fontSize="md"
                  color={isActive ? "red" : "green"}
                  fontWeight="bold"
                >
                  ACTIVE
                </Text>
              </Flex>
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

export default CreateLeagueDialog;
