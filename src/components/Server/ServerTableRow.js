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
import ServerDialog from "./ServerDialog";

function ServerTableRow(props) {
  const { logo, ip, user, password, status, date, isLast } = props;
  const textColor = useColorModeValue("gray.500", "white");
  const titleColor = useColorModeValue("gray.700", "white");
  const bgStatus = useColorModeValue("gray.400", "navy.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  function handleRowClick() {
    console.log("==========> ROY <============");
  }

  const {
    isOpen: isServerOpen,
    onOpen: onServerOpen,
    onClose: onServerClose,
  } = useDisclosure();

  return (
    <Tr>
      <Td
        minWidth={{ sm: "250px" }}
        pl="0px"
        borderColor={borderColor}
        borderBottom={isLast ? "none" : null}
      >
        <ServerDialog
          isOpen={isServerOpen}
          onOpen={onServerOpen}
          onClose={onServerClose}
          // tool={name}
          data={props}
        />
        <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
          <Avatar src={logo} w="50px" borderRadius="12px" me="18px" />
          <Flex direction="column">
            <Text
              fontSize="md"
              color={titleColor}
              fontWeight="bold"
              minWidth="100%"
            >
              {ip}
            </Text>
          </Flex>
        </Flex>
      </Td>

      <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
        <Flex direction="column">
          <Text fontSize="md" color={textColor} fontWeight="bold">
            {user}
          </Text>
        </Flex>
      </Td>
      <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
        <Flex direction="column">
          <Text fontSize="md" color={textColor} fontWeight="bold">
            {password}
          </Text>
        </Flex>
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
        <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
          {date}
        </Text>
      </Td>
      <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
        <Button
          p="0px"
          bg="transparent"
          variant="no-effects"
          onClick={onServerOpen}
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
    </Tr>
  );
}

export default ServerTableRow;
