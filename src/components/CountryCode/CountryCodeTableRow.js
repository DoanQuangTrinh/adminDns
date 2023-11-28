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

import ChangeStatusDialog from "./ChangeStatusDialog";

function CountryCodeTableRow(props) {
  const { row, isLast, fetchData } = props;
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
          <Flex direction="column">
            <Avatar src={row?.flag} w={"50px"} h={"50px"} rounded={"12px"} />
          </Flex>
        </Td>
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Flex direction="column">
            <Text fontSize="md" color={textColor} fontWeight="bold">
              {row?.name || "N/A"}
            </Text>
          </Flex>
        </Td>
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Flex direction="column">
            <Text fontSize="md" color={textColor} fontWeight="bold">
              {row?.code}
            </Text>
          </Flex>
        </Td>

        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Flex direction="column">
            <Text fontSize="md" color={textColor} fontWeight="bold">
              {row?.status === true ? "Active" : "InActive"}
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
              {row?.status === true ? "InActive" : "Active"}
            </Text>
          </Button>
        </Td>
      </Tr>
      <ChangeStatusDialog
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        fetchData={fetchData}
        idLink={row?._id}
        name={row?.name}
      />
    </>
  );
}

export default CountryCodeTableRow;
