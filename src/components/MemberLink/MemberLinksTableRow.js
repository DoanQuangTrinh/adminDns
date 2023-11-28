import {
  Avatar,
  Badge,
  Button,
  Flex,
  Td,
  Text,
  Tr,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React from "react";

import { axiosPost } from "../../utils/api";

import moment from "moment";
import EditLinkDialog from "components/Link/EditLinkDialog";

const deleteLinkApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_DELETE_URL;

function MemberLinksTableRow(props) {
  const { row, isLast, fetchData } = props;
  const textColor = useColorModeValue("gray.500", "white");
  const titleColor = useColorModeValue("gray.700", "white");
  const bgStatus = useColorModeValue("gray.400", "navy.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const toast = useToast();
  const {
    isOpen,
    onOpen,
    onClose,
  } = useDisclosure();

  function handleRowClick() {
    onOpen();
  }

  function handleDeleteRowClick() {
    console.log("==========> DELETE <============ " + _id);
    let data = axiosPost(deleteLinkApi, { _id: _id });

    if (data?.data?.code == 0) {
      toast({
        title: "Thành Công",
        // description: "We've created your account for you.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Thất Bại",
        // description: "We've created your account for you.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }

    // fetchData();
  }

  return (
    <>
      <Tr>
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Flex direction="column">
            <Text fontSize="md" color={textColor} fontWeight="bold">
              {row?.link?.name || "N/A"}
            </Text>
          </Flex>
        </Td>
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Flex direction="column">
            <Text fontSize="md" color={textColor} fontWeight="bold">
              {row?.link?.url}
            </Text>
          </Flex>
        </Td>

        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Flex direction="column">
            <Text fontSize="md" color={textColor} fontWeight="bold">
              {row?.link?.status === true ? "Active" : "InActive"}
            </Text>
          </Flex>
        </Td>
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Flex direction="column">
            <Text fontSize="md" fontWeight="bold" color={textColor}>
              {moment
                .parseZone(Number(row?.link?.datetime))
                .local()
                .format("YYYY-MM-DD HH:mm:ss")}
            </Text>
          </Flex>
        </Td>
        {/* <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
        <Badge
          bg={status === "Online" ? "green.400" : bgStatus}
          color={status === "Online" ? "white" : "white"}
          fontSize="16px"
          p="3px 10px"
          borderRadius="8px"
        >
          {status}
        </Badge>
      </Td> */}
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Button
            p="0px"
            bg="transparent"
            variant="no-effects"
            onClick={handleRowClick}
          >
            <Text
              fontSize="md"
              color="gray.400"
              fontWeight="bold"
              cursor="pointer"
            >
              Edit
            </Text>
          </Button>
        </Td>

        {/* <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
        <Button
          p="0px"
          // bg="red.400"
          variant="warning"
          onClick={handleDeleteRowClick}
        >
          Delete
        </Button>
      </Td> */}
      </Tr>
      <EditLinkDialog
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        data={row}
        fetchData={fetchData}
      />
    </>
  );
}

export default MemberLinksTableRow;
