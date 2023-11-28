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
import ApproveLinkDialog from "./ApproveLinkDialog";

function RequestLinkTableRow(props) {
  const { row, isLast, fetchData } = props;
  const textColor = useColorModeValue("gray.500", "white");
  const titleColor = useColorModeValue("gray.700", "white");
  const bgStatus = useColorModeValue("gray.400", "navy.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  function handleRowClick() {
    onOpen();
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
              {row?.member?.username}
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
              Approve
            </Text>
          </Button>
        </Td>
      </Tr>
      <ApproveLinkDialog
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        fetchData={fetchData}
        idLink={row?._id}
      />
    </>
  );
}

export default RequestLinkTableRow;
