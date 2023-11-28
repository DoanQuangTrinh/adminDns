import {
  Avatar,
  Badge,
  Button,
  Flex,
  IconButton,
  Td,
  Text,
  Tr,
  useColorModeValue,
  useDisclosure
} from "@chakra-ui/react";
import React from "react";
import UserDetailDialog from "./UserDetailDialog";
import { DeleteIcon, EditIcon, UnlockIcon } from "@chakra-ui/icons";
import UserResetPasswordDialog from "./UserResetPasswordDialog";


function UserRow(props) {
  const { userDetail, logo, id, name, email, phone, role, status, date, isLast, handelUpdateUser, refetch } = props;
  const textColor = useColorModeValue("gray.500", "white");
  const titleColor = useColorModeValue("gray.700", "white");
  const bgStatus = useColorModeValue("gray.400", "navy.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const { isOpen, onOpen, onClose } = useDisclosure();

  function handleRowClickResetPassword() {
    onOpen();
  }

  function handleRowClick() {
    console.log("==========> ROY <============", userDetail);
    handelUpdateUser(userDetail)
  }

  const {
    isOpen: isDetailOpen,
    onOpen: onDetailOpen,
    onClose: onDetailClose,
  } = useDisclosure();

  return (
    <Tr>
      <Td
        minWidth={{ sm: "250px" }}
        pl="0px"
        borderColor={borderColor}
        borderBottom={isLast ? "none" : null}
      >
        <UserDetailDialog
          isOpen={isDetailOpen}
          onOpen={onDetailOpen}
          onClose={onDetailClose}
          // tool={name}
          data={props}
        />
        <UserResetPasswordDialog
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          fetchData={refetch}
          id={id}
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
              {name}
            </Text>
            <Text fontSize="sm" color="gray.400" fontWeight="normal">
              {email}
            </Text>
          </Flex>
        </Flex>
      </Td>

      <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
        <Flex direction="column">
          <Text fontSize="md" color={textColor} fontWeight="bold">
            {phone}
          </Text>
        </Flex>
      </Td>

      <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
        <Flex direction="column">
          <Text fontSize="md" color={textColor} fontWeight="bold">
            {role}
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
        <IconButton
          p={2}
          bg="transparent"
          onClick={() => {
            handleRowClick();
          }}
        >
          <EditIcon />
        </IconButton>
      </Td>
      <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
        <IconButton
          p={2}
          bg="transparent"
          onClick={() => {
            handleRowClickResetPassword();
          }}
        >
          <UnlockIcon />
        </IconButton>
      </Td>
    </Tr>
  );
}

export default UserRow;
