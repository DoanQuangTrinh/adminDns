import React, { useState, useEffect, useMemo } from "react";

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
  Avatar,
  useToast,
  Text,
} from "@chakra-ui/react";

import { axiosPost } from "../../utils/api";
import { get } from "lodash";
import { LINK_REGEX } from "utils/constant";
import { FaFilm, FaVideo } from "react-icons/fa";
import { MAX_VIDEO_UPLOAD } from "utils/constant";

const createContentApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_CONTENT;

const updateContentApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_CONTENT_UPDATE;

const mediaUrl = process.env.REACT_APP_API_HOST;

const ContentRegisterDialog = ({
  isOpen,
  onOpen,
  onClose,
  fetchData,
  data,
}) => {
  const cancelRef = React.useRef();
  const fileInput = React.useRef(null);

  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [fileName, setFileName] = useState("");
  const [video, setVideo] = useState();
  const toast = useToast();

  useEffect(() => {
    if (data) {
      setName(data.name);
      setLink(data.link);
      const videoName = data?.videoUrl ? data.videoUrl.split('/').pop() : ''
      setFileName(videoName);
    }
  }, [data]);

  const clickUpdateButton = async () => {
    if (!link && !video) {
      toast({
        title: "Cần có ít nhất video hoặc link youtube",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    // if (link && !link.match(LINK_REGEX)) {
    //   toast({
    //     title: "Link youtube sai định dạng",
    //     status: "error",
    //     duration: 9000,
    //     isClosable: true,
    //   });
    //   return;
    // }

    const contentData = new FormData();
    contentData.append("name", name);
    if (link) {
      contentData.append("link", link);
    }
    if (video) {
      contentData.append("video", video);
    }
    if (data) {
      contentData.append("content_id", data._id);
    }
    const headers = {
      "content-type": "multipart/form-data",
    };
    try {
      const response = await axiosPost(
        data ? updateContentApi : createContentApi,
        contentData,
        headers
      );
      if (response?.data?.code == 0) {
        toast({
          title: data
            ? "Update Content Successfully"
            : "Create Content Successfully",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        fetchData();
        onClose();
        setName("");
        setLink("");
        setFileName("");
        setVideo(null);
      }
    } catch (error) {
      toast({
        title:
          error?.response?.data?.errors?.errors[0]?.msg ||
          error?.response?.data?.msg ||
          (data ? "Update Content Fail" : "Create Content Fail"),
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };
  const onChangeVideo = () => {
    const btn = fileInput?.current;
    if (btn !== null) {
      btn.click();
    }
  };

  const onCloseDialog = () => {
    if (!data) {
      setName("");
      setLink("");
      setFileName("");
      setVideo(null);
    }

    onClose();
  };
  return (
    <>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onCloseDialog}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>
            {!data ? "Create new content" : "Update the content"}
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <FormControl>
              <FormLabel>
                Video (Click below image to upload the video )
              </FormLabel>
              <Avatar
                // src={videoPreview}
                cursor={"pointer"}
                w="200px"
                h="100px"
                borderRadius="4px"
                me="18px"
                icon={
                  video ? (
                    <FaFilm fontSize="1.5rem" />
                  ) : (
                    <FaVideo fontSize="1.5rem" />
                  )
                }
                mb={3}
                onClick={onChangeVideo}
              />
              {fileName && <Text>{fileName}</Text>}
              <Input
                hidden
                type="file"
                ref={fileInput}
                accept="video/mp4"
                onChange={(event) => {
                  const fileVideo = event.target.files[0];
                  // if (fileVideo?.size > MAX_VIDEO_UPLOAD) {
                  //   toast({
                  //     title: "Chỉ hỗ trợ tải lên tối đa 30MB",
                  //     status: "error",
                  //     duration: 9000,
                  //     isClosable: true,
                  //   });
                  //   return;
                  // }
                  if (fileVideo?.type !== "video/mp4") {
                    toast({
                      title: "Chỉ hỗ trợ tải lên file mp4",
                      status: "error",
                      duration: 9000,
                      isClosable: true,
                    });
                    return;
                  }
                  setVideo(fileVideo);
                  setFileName(fileVideo?.name);
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
              <FormLabel>Link</FormLabel>
              <Input
                type="text"
                placeholder="Link"
                value={link}
                onChange={(event) => setLink(event.target.value)}
              />
            </FormControl>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onCloseDialog}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              ml={3}
              onClick={() => clickUpdateButton()}
              disabled={(!data && !video && !link) || !name}
            >
              Update
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ContentRegisterDialog;
