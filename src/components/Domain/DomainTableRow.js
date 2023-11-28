import {
  Avatar,
  Badge,
  Button,
  Flex,
  Td,
  Text,
  Tr,
  useColorModeValue,
  IconButton,
  Select,
  Collapse,
  Box,
  useDisclosure,
  Table,
  Thead,
  Tbody,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

import React, { useState, useEffect } from "react";
import DomainDialog from "./DomainDialog";
import { vendorDomain, pbnStage } from "config/config";
import "./style.css";


const deleteDomainApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_CREATE_DOMAIN;

function DomainTableRow(props) {
  const {
    domain,
    Th,
    vendor,
    colorEx,
    type,
    team,
    color,
    expired,
    ipServer,
    adminUrl,
    adminUser,
    adminPass,
    nameserver1,
    nameserver2,
    active,
    date,
    isLast,
  } = props;
  const textColor = useColorModeValue("gray.500", "white");
  const titleColor = useColorModeValue("gray.700", "white");
  const bgStatus = useColorModeValue("gray.400", "navy.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const [expandedRows, setExpandedRows] = useState([]);

  const {
    isOpen: isDomainOpen,
    onOpen: onDomainOpen,
    onClose: onDomainClose,
  } = useDisclosure();

  function handleRowClick() {
    console.log("==========> ROY <============");
  }


  function handleDeleteRowClick() {
    console.log("==========> ROY <============");
  }

  useEffect(() => {
    console.log("==========> <============ " + color);
  }, []);

  const toggleRow = (id) => {
    if (expandedRows.includes(id)) {
      setExpandedRows(expandedRows.filter((rowId) => rowId !== id));
    } else {
      setExpandedRows([...expandedRows, id]);
    }
  };

  return (
    <>
      <Flex>
        <Tr>
          <Td borderBottom={isLast ? "none" : null}>
            <DomainDialog
              isOpen={isDomainOpen}
              onOpen={onDomainOpen}
              onClose={onDomainClose}
              data={props}
            />

            <Flex direction="column">
              <Text fontSize="xl" color={"red.400"} fontWeight="bold" w="300px">
                {domain}
              </Text>

              <Text className="vendor" bg={color}>
                {vendor}
              </Text>
              <Text className="expired" bg={colorEx}>
                expired : {expired}
              </Text>
              {/* </Flex> */}
            </Flex>
          </Td>
          <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
            <Flex direction="column" w="230px">
              <Text fontSize="md" color={textColor} fontWeight="bold">
                {team}
              </Text>
              <Text fontSize="sm" color="gray.400" fontWeight="normal">
                type : {type}
              </Text>

              {type !== "PBN" ? (
                <Text></Text>
              ) : (
                <Select
                  w="180px"
                  onChange={(e) => {
                    // setVendor(e.target.value);
                  }}
                >
                  {pbnStage.map((option) => (
                    <option
                      key={option.value}
                      maxH="10px"
                      value={option.value}
                      colorScheme={option.color}
                      fontSize="sm"
                    >
                      {option.value}
                    </option>
                  ))}
                </Select>
              )}
            </Flex>
          </Td>

          <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
            <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
              {ipServer}
            </Text>
          </Td>

          <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
            <Badge
              bg={active === "Online" ? "green.400" : bgStatus}
              color={active === "Online" ? "white" : "white"}
              fontSize="16px"
              p="3px 10px"
              borderRadius="8px"
            >
              {active}
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
              onClick={handleDeleteRowClick}
            >
              <Text
                fontSize="md"
                color="gray.400"
                fontWeight="bold"
                cursor="pointer"
              >
                Delete
              </Text>
            </Button>
          </Td>

          <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
            <Button
              p="0px"
              bg="transparent"
              variant="no-effects"
              onClick={onDomainOpen}
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
            <Box as="tr" key={domain}>
              <IconButton
                icon={<ChevronDownIcon />}
                onClick={() => toggleRow(domain)}
                aria-label={
                  expandedRows.includes(domain)
                    ? "Hide details"
                    : "Show details"
                }
              />
            </Box>
          </Td>
        </Tr>
        {/* </Box> */}
      </Flex>
      <Flex>
        <Table>
          {expandedRows.includes(domain) && (
            <Collapse in={true}>
              <Td borderBottom={isLast ? "none" : null}>
                <Flex direction="column">
                  <Text fontSize="md" color={textColor} fontWeight="bold">
                    {adminUrl}
                  </Text>
                  <Text fontSize="md" color={textColor} fontWeight="bold">
                    {adminUser} / {adminPass}
                  </Text>
                </Flex>
              </Td>

              <Td
                borderColor={borderColor}
                borderBottom={isLast ? "none" : null}
              >
                <Flex direction="column">
                  <Text fontSize="md" color={textColor} fontWeight="bold">
                    {nameserver1}
                  </Text>
                  <Text fontSize="md" color={textColor} fontWeight="bold">
                    {nameserver2}
                  </Text>
                </Flex>
              </Td>
            </Collapse>
          )}
        </Table>
      </Flex>

      {/*  */}
    </>
    // </>
  );
}

export default DomainTableRow;
