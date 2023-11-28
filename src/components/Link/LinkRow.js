import {
  Avatar,
  Badge,
  Button,
  Flex,
  Td,
  Text,
  Tr,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import React from "react";

import { axiosPost } from "../../utils/api";

const deleteLinkApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_DELETE_URL;

function LinkRow(props) {
  const {
    _id,
    logo,
    name,
    url,
    loop,
    order,
    status,
    timer,
    refetch,
    isLast,
  } = props;
  const textColor = useColorModeValue("gray.500", "white");
  const titleColor = useColorModeValue("gray.700", "white");
  const bgStatus = useColorModeValue("gray.400", "navy.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const toast = useToast();

  function handleRowClick() {
    console.log("==========> create link <============ ");
  }

  function handleDeleteRowClick() {
    axiosPost(deleteLinkApi, { _id: _id });
    
    fetchData();
  }

  const fetchData = () => {
    props.refetch();
  };

  return (
    <Tr>
      <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
        <Flex direction="column">
          <Text fontSize="md" color={textColor} fontWeight="bold">
            {name}
          </Text>
        </Flex>
      </Td>
      <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
        <Flex direction="column">
          <Text fontSize="md" color={textColor} fontWeight="bold">
            {url}
          </Text>
        </Flex>
      </Td>

      <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
        <Flex direction="column">
          <Text fontSize="md" color={textColor} fontWeight="bold">
            {loop}
          </Text>
        </Flex>
      </Td>
      <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
        <Flex direction="column">
          <Text fontSize="md" fontWeight="normal">
            {order}
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
        <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
          {status === true ? "Active" : "Inactive"}
        </Text>
      </Td>
      <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
        <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
          {timer}
        </Text>
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
            Edit
          </Text>
        </Button>
      </Td>

      <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
        <Button
          p="0px"
          // bg="red.400"
          variant="warning"
          onClick={handleDeleteRowClick}
        >
          Delete
        </Button>
      </Td>
    </Tr>
  );
}

export default LinkRow;
