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

import KeywordDialog from "./KeywordDialog";
import WebsiteDialog from "./WebsiteDialog";

function TablesTableRow(props) {
  const { logo, name, isLast } = props;
  const textColor = useColorModeValue("gray.500", "white");
  const titleColor = useColorModeValue("gray.700", "white");
  const bgStatus = useColorModeValue("gray.400", "navy.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  function exportDataClick() {
    console.log("==========> ROY <============");
  }

  // function exportDataClick() {
  //   console.log("==========> ROY <============");
  // }

  const {
    isOpen: isKeywordOpen,
    onOpen: onKeywordOpen,
    onClose: onKeywordClose,
  } = useDisclosure();

  const {
    isOpen: isWebsiteOpen,
    onOpen: onWebsiteOpen,
    onClose: onWebsiteClose,
  } = useDisclosure();

  return (
    <Tr>
      <Td
        minWidth={{ sm: "250px" }}
        pl="0px"
        borderColor={borderColor}
        borderBottom={isLast ? "none" : null}
      >
        {" "}
        <WebsiteDialog
          isOpen={isWebsiteOpen}
          onOpen={onWebsiteOpen}
          onClose={onWebsiteClose}
          // tool={name}
          data={props}
        />
        <KeywordDialog
          isOpen={isKeywordOpen}
          onOpen={onKeywordOpen}
          onClose={onKeywordClose}
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
              {name}
            </Text>
          </Flex>
        </Flex>
      </Td>

      <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
        {name == "External Link" ? (
          <Text></Text>
        ) : (
          <Button
            p="0px"
            bg="transparent"
            variant="no-effects"
            onClick={onKeywordOpen}
          >
            <Text
              fontSize="md"
              color="gray.400"
              fontWeight="bold"
              cursor="pointer"
            >
              Add Keyword
            </Text>
          </Button>
        )}
      </Td>
      <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
        <Button
          p="0px"
          bg="transparent"
          variant="no-effects"
          onClick={onWebsiteOpen}
        >
          <Text
            fontSize="md"
            color="gray.400"
            fontWeight="bold"
            cursor="pointer"
          >
            Add Website
          </Text>
        </Button>
      </Td>
      <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
        <Button
          p="0px"
          bg="transparent"
          variant="no-effects"
          onClick={exportDataClick}
        >
          <Text
            fontSize="md"
            color="gray.400"
            fontWeight="bold"
            cursor="pointer"
            git
          >
            Export
          </Text>
        </Button>
      </Td>
    </Tr>
  );
}

export default TablesTableRow;
