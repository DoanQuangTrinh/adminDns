import {
  Avatar,
  Badge,
  Button,
  Checkbox,
  Flex,
  Link,
  Td,
  Text,
  Tr,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { axiosPost } from "utils/api";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import ContentRegisterDialog from "./ContentRegisterDialog";
import PreviewVideo from "./PreviewVideo";
import { BiPhotoAlbum } from "react-icons/bi";
import UploadThumbnail from "./UploadThumbnail";
import { ROOT_API } from "utils/constant";
const deleteContentApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_CONTENT_DELETE;
const activeContentApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_CONTENT_ACTIVE;

function ContentRow(props) {
  const { data, isLast, fetchData } = props;
  const textColor = useColorModeValue("gray.500", "white");
  const linkColor = useColorModeValue("blue.500", "blue");
  const titleColor = useColorModeValue("gray.700", "white");
  const bgStatus = useColorModeValue("gray.400", "navy.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const approvedColor = useColorModeValue("green.600", "green.900");
  const pendingColor = useColorModeValue("red.500", "red.900");
  const toast = useToast();
  const {
    isOpen: isRegisterOpen,
    onOpen: onRegisterOpen,
    onClose: onRegisterClose,
  } = useDisclosure();
  const {
    isOpen: isUploadOpen,
    onOpen: onUploadOpen,
    onClose: onUploadClose,
  } = useDisclosure();
  const {
    isOpen: isPreviewVideoOpen,
    onOpen: onPreviewVideoOpen,
    onClose: onPreviewVideoClose,
  } = useDisclosure();

  function handleRowClick() {
    onRegisterOpen();
  }

  async function handleDeleteClick() {
    if (window.confirm("Are you sure to delete the content?")) {
      const contentData = {
        id: data?._id,
      };
      try {
        const response = await axiosPost(deleteContentApi, contentData);
        if (response?.data?.code == 0) {
          toast({
            title: "Delete Content Successfully",
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
            "Delete Content Fail",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }
  }
  async function setActiveContent() {
    if (window.confirm("Are you sure to active the content?")) {
      const contentData = {
        id: data?._id,
        isActive: data?.isActive ? false : true,
      };
      try {
        const response = await axiosPost(activeContentApi, contentData);
        if (response?.data?.code == 0) {
          toast({
            title: "Update status content successfully",
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
            "Update status content fail",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }
  }

  const getFileName = (path) => {
    if (path) {
      const fileName = path?.split("/")?.pop();
      return (
        <Button variant="unstyled" onClick={() => onPreviewVideoOpen()}>
          {fileName}
        </Button>
      );
    }
    return "";
  };
  //
  return (
    <>
      <Tr>
        <Td
          borderColor={borderColor}
          borderBottom={isLast ? "none" : null}
          minWidth={150}
        >
          <Flex direction="column">
            <Text fontSize="md" color={textColor} fontWeight="bold">
              {data?.name}
            </Text>
          </Flex>
        </Td>
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Flex direction="column">
            <Text fontSize="md" color={textColor} fontWeight="bold">
              {getFileName(data?.videoUrl)}
            </Text>
          </Flex>
        </Td>
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Flex direction="column">
            <Text fontSize="md" color={linkColor} fontWeight="bold">
              <Link href={data.link} target="_blank">
                {data?.link}
              </Link>
            </Text>
          </Flex>
        </Td>
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Flex direction="column">
            {data.thumbnailUrl && (
              <Avatar
                src={ROOT_API + data.thumbnailUrl}
                w="200px"
                h="100px"
                borderRadius="4px"
                me="18px"
              />
            )}
          </Flex>
        </Td>
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Flex direction="column">
            <Checkbox
              id={data?._id}
              value={data?.isActive}
              isChecked={data?.isActive}
              onChange={setActiveContent}
            >
              <Text
                fontSize="md"
                color={data?.isActive ? approvedColor : pendingColor}
                fontWeight="bold"
              >
                {/* {data?.isActive ? "Active" : "InActive"} */}
                Active
              </Text>
            </Checkbox>
          </Flex>
        </Td>
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Button
            px="2"
            bg="transparent"
            // variant="no-effects"
            onClick={onUploadOpen}
            mr={4}
          >
            <BiPhotoAlbum />
          </Button>
          <Button
            px="2"
            bg="transparent"
            // variant="no-effects"
            onClick={handleRowClick}
            mr={4}
          >
            <EditIcon />
          </Button>
          <Button
            px="2"
            bg="transparent"
            // variant="no-effects"
            onClick={handleDeleteClick}
          >
            <DeleteIcon />
          </Button>
        </Td>
      </Tr>
      <ContentRegisterDialog
        isOpen={isRegisterOpen}
        onOpen={onRegisterOpen}
        onClose={onRegisterClose}
        fetchData={fetchData}
        data={data}
      />
      <UploadThumbnail
        isOpen={isUploadOpen}
        onOpen={onUploadOpen}
        onClose={onUploadClose}
        fetchData={fetchData}
        data={data}
      />
      {data?.videoUrl && (
        <PreviewVideo
          isOpen={isPreviewVideoOpen}
          onOpen={onPreviewVideoOpen}
          onClose={onPreviewVideoClose}
          videoUrl={data.videoUrl}
        />
      )}
    </>
  );
}

export default ContentRow;
