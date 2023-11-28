import {
  Avatar,
  Badge,
  Button,
  Flex,
  Td,
  Box,
  Text,
  IconButton,
  Tr,
  useColorModeValue,
  useDisclosure,
  Icon,
  useToast,
} from "@chakra-ui/react";
import moment from "moment";
import React, { useState } from "react";
import { DeleteIcon } from "@chakra-ui/icons";
import { axiosPost } from "utils/api";
const deleteLinkApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_CDN_DELETE_CDN_LINK;

function CDNRow(props) {
  const { data, isLast, fetchData, id } = props;
  const textColor = useColorModeValue("gray.500", "white");
  const titleColor = useColorModeValue("gray.700", "white");
  const bgStatus = useColorModeValue("gray.400", "navy.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const toast = useToast();
  const [expandedRows, setExpandedRows] = useState([]);

  async function handleDeleteClick() {
    if (window.confirm("Are you sure to delete the cdn link?")) {
      const linkData = {
        id,
      };
      try {
        const response = await axiosPost(deleteLinkApi, linkData);
        if (response?.data?.code == 0) {
          toast({
            title: "Delete Link Successfully",
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
            "Delete Link Fail",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }
  }

  return (
    <>
      {/* <Flex maxW="full"> */}
      <Tr>
        <Td
          borderColor={borderColor}
          borderBottom={isLast ? "none" : null}
          maxWidth="300px"
        >
          <Text fontSize="md" color={textColor} fontWeight="bold">
            {data?.link}
          </Text>
        </Td>
        <Td
          borderColor={borderColor}
          borderBottom={isLast ? "none" : null}
          maxWidth="300px"
        >
          <Text fontSize="md" color={textColor} fontWeight="bold">
            {data?.linkBackup}
          </Text>
        </Td>

        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Text fontSize="md" color={textColor}>
            {moment.utc(data?.createdAt).local().format("YYYY-MM-DD HH:mm:ss")}
          </Text>
        </Td>

        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Button
            p="0px"
            bg="transparent"
            variant="no-effects"
            onClick={handleDeleteClick}
          >
            <DeleteIcon />
          </Button>
        </Td>
      </Tr>
    </>
  );
}

export default CDNRow;
