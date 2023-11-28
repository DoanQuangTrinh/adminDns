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
import DomainDialog from "./DomainDialog";

function PropertyTableRow(props) {
  const { propertyId, propertyName, Category, status, isLast } = props;

  const textColor = useColorModeValue("gray.500", "white");
  const titleColor = useColorModeValue("gray.700", "white");
  const bgStatus = useColorModeValue("gray.400", "navy.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const {
    isOpen: isDomainOpen,
    onOpen: onDomainOpen,
    onClose: onDomainClose,
  } = useDisclosure();

  function handleRowClick() {
    console.log("==========> ROY <============");
  }

  return (
    <Tr>
      <Td
        minWidth={{ sm: "250px" }}
        pl="0px"
        borderColor={borderColor}
        borderBottom={isLast ? "none" : null}
      >
        <DomainDialog
          isOpen={isDomainOpen}
          onOpen={onDomainOpen}
          onClose={onDomainClose}
          // tool={name}
          data={props}
        />

        <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
          <Flex direction="column">
            <Text
              fontSize="md"
              color={titleColor}
              fontWeight="bold"
              minWidth="100%"
            >
              {propertyId}
            </Text>
          </Flex>
        </Flex>
      </Td>
      <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
        <Flex direction="column">
          <Text fontSize="md" color={textColor} fontWeight="bold">
            {propertyName}
          </Text>
        </Flex>
      </Td>

      <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
        <Flex direction="column">
          <Text fontSize="md" color={textColor} fontWeight="bold">
            {Category}
          </Text>
        </Flex>
      </Td>

      <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
        <Badge
          bg={status === "Online" ? "green.400" : bgStatus}
          color={status === "Online" ? "white" : "white"}
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
          onClick={() => {
            alert("Comming soon");
          }}
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

export default PropertyTableRow;
