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
  Radio,
  RadioGroup,
} from "@chakra-ui/react";

import { axiosPost } from "../../utils/api";

const addKolMatchApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_CDN_ADD_KOL_INTO_LINK;

const AddKolIntoLinkDialog = (props) => {
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
    link,
  } = props;

  const [selectedKol, setSelectedKol] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (link?.kol) {
      setSelectedKol(link?.kol);
    }
  }, [link]);

  const clickChooseKolButton = async () => {
    setLoading(true);
    const dataUpdate = {
      kol_id: selectedKol,
      linkId: link._id,
    };
    // console.log("dataCurrentMatch", dataCurrentMatch);
    try {
      const data = await axiosPost(
        addKolMatchApi + "/" + dataCurrentMatch?.matchId,
        dataUpdate
      );
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
        onClose();
      }
      setLoading(false);
    } catch (error) {
      console.log(error)
      toast({
        title:
          error?.response?.data?.errors?.errors[0]?.msg ||
          error?.response?.data?.msg ||
          "Choose Kol Fail",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      setLoading(false);  
    }
  };
  const onSelectKol = (value) => {
      setSelectedKol(value);
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
              {/* <CheckboxGroup
                onChange={onSelectKol}
                value={selectedKols}
                name="kol-radio"
              > */}
              <RadioGroup
                onChange={onSelectKol}
                value={selectedKol}
                name="kol-radio"
              >
                {dataKols?.kols?.length
                  ? dataKols.kols.map((kol) => {
                      return (
                        <>
                          <Flex direction={"row"} columnGap={4} m={2} w="full">
                            {/* <Checkbox
                              value={kol._id}
                              id={`r-${kol._id}`}
                              onChange={onSelectKol}
                            > */}
                            <Radio value={kol._id} id={`r-${kol._id}`} />
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
                            {/* </Checkbox> */}
                          </Flex>
                          <Divider />
                        </>
                      );
                    })
                  : ""}
              </RadioGroup>
            </List>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={() => {
                onClose();
                setSelectedKol('');
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
              disabled={!selectedKol || loading}
            >
              Choose
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AddKolIntoLinkDialog;
