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
} from "@chakra-ui/react";
import React from "react";
import ApproveMemberDialog from "./ApproveMemberDialog";

function MemberRow(props) {
  const { username, email, status, date, isLast, refetch } = props;
  const textColor = useColorModeValue("gray.500", "white");
  const titleColor = useColorModeValue("gray.700", "white");
  const bgStatus = useColorModeValue("gray.400", "navy.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const { isOpen, onOpen, onClose } = useDisclosure();

  function handleRowClick() {
    onOpen();
  }

  return (
    <>
      <Tr>
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Text fontSize="md" color={textColor} fontWeight="bold">
            {date}
          </Text>
        </Td>

        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Text
            fontSize="md"
            color={titleColor}
            fontWeight="bold"
            minWidth="100%"
          >
            {username}
          </Text>
        </Td>

        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Text fontSize="md" color={textColor} fontWeight="bold">
            {email}
          </Text>
        </Td>

        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Badge
            bg={status === "Online" ? "green.400" : bgStatus}
            color={status === "Online" ? "white" : "white"}
            fontSize="16px"
            p="3px 10px"
            borderRadius="8px"
          >
            {status}
          </Badge>
        </Td>

        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Button
            p="0px"
            bg="transparent"
            variant="no-effects"
            onClick={status !== "approved" && handleRowClick}
          >
            <Text
              fontSize="md"
              color="gray.400"
              fontWeight="bold"
              cursor="pointer"
            >
              {status !== "approved" ? "Approve" : "-"}
            </Text>
          </Button>
        </Td>
      </Tr>
      <ApproveMemberDialog
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        fetchData={refetch}
        userName={username}
      />
    </>
  );
}

export default MemberRow;
