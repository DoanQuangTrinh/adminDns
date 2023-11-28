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
  Avatar,
  FormLabel,
  FormControl,
  Input,
} from "@chakra-ui/react";

import { axiosPost } from "../../utils/api";
import { ROOT_API } from "utils/constant";

const setHotMatchApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_MATCH_SET_HOT;

const SetHotMatchDialog = (props) => {
  const cancelRef = React.useRef();
  const toast = useToast();
  const textColor = useColorModeValue("gray.500", "white");
  const {
    isOpen,
    onOpen,
    onClose,
    fetchData,
    dataCurrentMatch,
  } = props;

  const [featuredImg, setFeaturedImg] = useState();
  const [imgPreview, setImgPreview] = useState();
  const [loading, setLoading] = useState(false);
  const fileInput = React.useRef(null);
  useEffect(() => {
    if (dataCurrentMatch?.imageUrl) {
      // const selectedKols = detailMatch.kolMatches.map((kol) => kol._id);
      setImgPreview(ROOT_API + '/' + dataCurrentMatch.imageUrl);
    }
  }, [dataCurrentMatch]);

  const clickUpdateMatch = async (isNormal = false) => {
    setLoading(true);
    const dataUpdate = new FormData();
    dataUpdate.append("matchId", dataCurrentMatch?.matchId);
    if (featuredImg) {
      dataUpdate.append("image", featuredImg);
    }
    if (isNormal) {
      dataUpdate.append("isNormal", true);
    }
    const headers = {
      "content-type": "multipart/form-data",
    };
    try {
      const data = await axiosPost(setHotMatchApi, dataUpdate, headers);
      if (
        data?.data?.code == 0 ||
        data?.status === 200 ||
        data?.status === 201
      ) {
        toast({
          title: "Update Match Successfully",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        fetchData();
        // getDetailMatch();
        onClose();
      }
      setLoading(false);
    } catch (error) {
      toast({
        title:
          error?.response?.data?.errors?.errors[0]?.msg ||
          error?.response?.data?.msg ||
          "Update Match Fail",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const onChangeImage = () => {
    const btn = fileInput?.current;
    if (btn !== null) {
      btn.click();
    }
  };

  return (
    <>
      <AlertDialog
        size="xl"
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>The Feature Match</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <FormControl>
              <FormLabel mb={3} fontWeight={600}>
                Click below image to upload the featured image and set feature for match
              </FormLabel>
              <Avatar
                src={imgPreview}
                w="270px"
                h="157px"
                me="18px"
                mb={3}
                borderRadius={0}
                onClick={onChangeImage}
              />
              <Input
                hidden
                type="file"
                ref={fileInput}
                onChange={(event) => {
                  setFeaturedImg(event.target.files[0]);
                  const image = URL.createObjectURL(event.target.files[0]);
                  setImgPreview(image);
                }}
              />
            </FormControl>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={() => {
                onClose();
                setFeaturedImg();
              }}
            >
              Cancel
            </Button>
            <Button
              colorScheme="red"
              ml={3}
              onClick={() => {
                clickUpdateMatch();
              }}
              disabled={!imgPreview || loading}
            >
              {dataCurrentMatch?.isHot ? "Update" : "Set Feature Match"}
            </Button>
            {dataCurrentMatch?.isHot && (
              <Button
                colorScheme="green"
                ml={3}
                onClick={() => {
                  clickUpdateMatch(true);
                }}
              >
                Set Normal Match
              </Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SetHotMatchDialog;
