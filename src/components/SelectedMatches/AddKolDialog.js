import React, { useState, useEffect } from "react";

import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  useToast,
  useColorModeValue,
  Flex,
  List,
  ListItem,
  Divider,
  Avatar,
  Checkbox,
  FormLabel,
  CheckboxGroup,
} from "@chakra-ui/react";

import { axiosPost } from "../../utils/api";

const addKolMatchApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_MATCH_ADD_KOL;

const AddKolDialog = (props) => {
  const cancelRef = React.useRef();
  const toast = useToast();
  const textColor = useColorModeValue("gray.500", "white");
  const {
    isOpen,
    onOpen,
    onClose,
    fetchData,
    dataCurrentMatch,
    dataKols,
    detailMatch,
    getDetailMatch,
  } = props;

  const [selectedKols, setSelectedKols] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (detailMatch?.kolMatches?.length) {
      const selectedKols = detailMatch.kolMatches.map(kol => kol._id)
      setSelectedKols(selectedKols);
    }
  }, [detailMatch]);

  const clickChooseKolButton = async () => {
    setLoading(true)
    const dataUpdate = {
      matchId: dataCurrentMatch?.fixture?.id,
      league: dataCurrentMatch?.league?.name,
      homeTeamLogo: dataCurrentMatch?.teams?.home?.logo,
      homeTeamName: dataCurrentMatch?.teams?.home?.name,
      awayTeamLogo: dataCurrentMatch?.teams?.away?.logo,
      awayTeamName: dataCurrentMatch?.teams?.away?.name,
      time: dataCurrentMatch?.fixture?.timestamp,
      kol_ids: selectedKols?.length ? selectedKols.join(",") : "",
    };
    // console.log(dataUpdate)
    try {
      const data = await axiosPost(addKolMatchApi, dataUpdate);
      if (
        data?.data?.code == 0 ||
        data?.status === 200 ||
        data?.status === 201
      ) {
        toast({
          title: "Choose Kol Successfully",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        fetchData();
        getDetailMatch();
        onClose();
      }
      setLoading(false)
    } catch (error) {
      toast({
        title:
          error?.response?.data?.errors?.errors[0]?.msg ||
          error?.response?.data?.msg ||
          "Choose Kol Fail",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      setLoading(false)
    }
  };
  const onSelectKol = (value) => {
    console.log(value, "1")
    if (Array.isArray(value)) {
      setSelectedKols(value);
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
          <AlertDialogHeader>Choose Kol To Add</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <List spacing={3}>
              <CheckboxGroup
                onChange={onSelectKol}
                value={selectedKols}
                name="kol-radio"
              >
                {dataKols?.kols?.length
                  ? dataKols.kols.map((kol) => {
                    return (
                      <>
                        <Flex direction={"row"} columnGap={4} m={2} w="full">
                          <Checkbox
                            value={kol._id}
                            id={`r-${kol._id}`}
                            onChange={onSelectKol}
                          >
                            <FormLabel htmlFor={`r-${kol._id}`} w={"full"}>
                              <Flex
                                direction={"row"}
                                columnGap={4}
                                m={2}
                                cursor={"pointer"}
                              >
                                <Avatar
                                  src={kol.avatar}
                                  w="50px"
                                  h="50px"
                                  borderRadius={12}
                                />
                                <ListItem key={kol._id} color={textColor}>
                                  {kol?.name}
                                </ListItem>
                              </Flex>
                            </FormLabel>
                          </Checkbox>
                        </Flex>
                        <Divider />
                      </>
                    );
                  })
                  : ""}
              </CheckboxGroup>
            </List>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={() => {
                onClose();
                setSelectedKols([]);
              }}
            >
              Cancel
            </Button>
            <Button
              colorScheme="red"
              ml={3}
              onClick={() => {
                clickChooseKolButton();
              }}
              disabled={!selectedKols?.length || loading}
            >
              Choose
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AddKolDialog;
