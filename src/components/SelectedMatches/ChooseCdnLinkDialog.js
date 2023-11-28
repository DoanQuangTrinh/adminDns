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
  FormLabel,
  RadioGroup,
  Radio,
} from "@chakra-ui/react";

import { axiosPost } from "../../utils/api";
import moment from "moment";

const addLinkMatchApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_MATCH_ADD_LINK;

const ChooseCdnLinkDialog = (props) => {
  const cancelRef = React.useRef();
  const toast = useToast();
  const textColor = useColorModeValue("gray.500", "white");
  const {
    isOpen,
    onOpen,
    onClose,
    fetchData,
    dataCurrentMatch,
    cndLinks,
  } = props;

  const [selectedCdn, setSelectedCdn] = useState(0);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (dataCurrentMatch?.cdnLink) {
      setSelectedCdn(dataCurrentMatch.cdnLink);
    }
  }, [dataCurrentMatch]);

  const clickChooseCdnButton = async () => {
    setLoading(true);
    const dataUpdate = {
      matchId: dataCurrentMatch?.matchId,
      cdnId: selectedCdn,
    };
    try {
      const data = await axiosPost(addLinkMatchApi, dataUpdate);
      if (
        data?.data?.code == 0 ||
        data?.status === 200 ||
        data?.status === 201
      ) {
        toast({
          title: "Choose CDN Link Successfully",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        fetchData();
        onClose();
      }
      setLoading(false);
    } catch (error) {
      toast({
        title:
          error?.response?.data?.errors?.errors[0]?.msg ||
          error?.response?.data?.msg ||
          "Choose CDN Link Fail",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      setLoading(false);
    }
  };
  const onSelectCdn = (value) => {
    setSelectedCdn(value);
  };

  const setNoLive = async () => {
    if (window.confirm("Are you sure your match settings aren't live?")) {
      const dataUpdate = {
        matchId: dataCurrentMatch?.matchId,
        noLive: true,
      };
      try {
        const response = await axiosPost(addLinkMatchApi, dataUpdate);
        if (response?.data?.code == 0) {
          toast({
            title: "Set No Live Successfully",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          fetchData();
        }
      } catch (error) {
        toast({
          title:
            error?.response?.data?.errors?.errors[0]?.msg ||
            error?.response?.data?.msg ||
            "Set No Live Fail",
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
        size="xl"
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Choose CDN Link To Use</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <List spacing={3}>
              <RadioGroup
                onChange={onSelectCdn}
                value={selectedCdn}
                name="kol-radio"
              >
                {cndLinks?.data?.length
                  ? cndLinks.data.map((link) => (
                      <>
                        <Flex
                          direction={"row"}
                          columnGap={4}
                          m={2}
                          w="full"
                          key={link._id}
                        >
                          <Radio value={link._id} id={`r-${link._id}`} />
                          <FormLabel htmlFor={`r-${link._id}`} w={"full"} m={0}>
                            <Flex
                              direction={"row"}
                              columnGap={4}
                              m={2}
                              cursor={"pointer"}
                            >
                              <ListItem color={textColor} wordBreak="break-all">
                                {link?.link}
                              </ListItem>
                            </Flex>
                          </FormLabel>
                        </Flex>
                        <Divider />
                      </>
                    ))
                  : ""}
              </RadioGroup>
            </List>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={() => {
                onClose();
                setSelectedCdn(null);
              }}
            >
              Cancel
            </Button>
            <Button
              colorScheme="red"
              ml={3}
              onClick={() => {
                clickChooseCdnButton();
              }}
              disabled={!selectedCdn || loading}
            >
              Live
            </Button>
            {dataCurrentMatch?.isLive && (
              <Button colorScheme="red" ml={3} onClick={setNoLive}>
                No Live
              </Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ChooseCdnLinkDialog;
