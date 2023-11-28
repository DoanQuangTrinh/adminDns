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
import { FaFilm, FaPhotoVideo, FaVideo } from "react-icons/fa";
import { MAX_VIDEO_UPLOAD } from "utils/constant";
import { ROOT_API } from "utils/constant";
import { API_ROUTES } from "utils/constant";

const createContentApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_CONTENT;

const updateContentApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_CONTENT_UPDATE;

const mediaUrl = process.env.REACT_APP_API_HOST;

const UploadThumbnail = ({ isOpen, onOpen, onClose, fetchData, data }) => {
  const cancelRef = React.useRef();
  const fileInput = React.useRef(null);

  const [fileName, setFileName] = useState("");
  const [image, setImage] = useState();
  const [imagePreview, setImagePreview] = useState();
  const toast = useToast();

  useEffect(() => {
    if (data) {
      const imageName = data?.thumbnailUrl
        ? data.thumbnailUrl.split("/").pop()
        : "";
      setFileName(imageName);
      if (data?.thumbnailUrl) {
        setImagePreview(ROOT_API + data.thumbnailUrl);
      }
    }
  }, [data]);

  const clickUpdateButton = async () => {
    if (!image) {
      toast({
        title: "Thumbnail File is require",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    const contentData = new FormData();
    if (image) {
      contentData.append("imageFile", image);
    }
    if (data) {
      contentData.append("contentId", data._id);
    }
    const headers = {
      "content-type": "multipart/form-data",
    };
    try {
      const response = await axiosPost(
        ROOT_API + API_ROUTES.UPLOAD_THUMBNAIL,
        contentData,
        headers
      );
      if (response?.data?.code == 0) {
        toast({
          title: "Upload Thumbnail Successfully",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        fetchData();
        onClose();
        setFileName("");
        setImage(null);
      }
    } catch (error) {
      console.log(error);
      toast({
        title:
          error?.response?.data?.errors?.errors[0]?.msg ||
          error?.response?.data?.msg ||
          "Upload Thumbnail Fail",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };
  const onChangeImage = () => {
    const btn = fileInput?.current;
    if (btn !== null) {
      btn.click();
    }
  };

  const onCloseDialog = () => {
    if (!data) {
      setFileName("");
      setImage(null);
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
          <AlertDialogHeader>{"Upload The Thumbnail"}</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <FormControl>
              <FormLabel>Thumbnail (Click on the image below to change)</FormLabel>
              <Avatar
                src={imagePreview}
                cursor={"pointer"}
                w="200px"
                h="100px"
                borderRadius="4px"
                me="18px"
                icon={<FaPhotoVideo fontSize="1.5rem" />}
                mb={3}
                onClick={onChangeImage}
              />
              {fileName && <Text>{fileName}</Text>}
              <Input
                hidden
                type="file"
                ref={fileInput}
                accept="image/*"
                onChange={(event) => {
                  const fileImage = event.target.files[0];
                  const regex = new RegExp(
                    /[^\s]+(.*?).(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/
                  );
                  if (!regex.test(fileImage.type)) {
                    // if (fileImage?.type !== "image/*") {
                    toast({
                      title: "Chỉ hỗ trợ tải lên file image",
                      status: "error",
                      duration: 9000,
                      isClosable: true,
                    });
                    return;
                  }
                  setImage(fileImage);
                  const thumbnail = URL.createObjectURL(event.target.files[0]);
                  setImagePreview(thumbnail);
                  setFileName(fileImage?.name);
                }}
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
              disabled={!data && !image}
            >
              Upload
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UploadThumbnail;
