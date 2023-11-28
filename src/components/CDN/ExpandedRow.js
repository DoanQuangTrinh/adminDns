import {
  Avatar,
  Badge,
  Button,
  Flex,
  Text,
  Collapse,
  Box,
  useDisclosure,
  Table,
  useToast,
  Spacer,
} from "@chakra-ui/react";

import React, { useState, useEffect } from "react";

import { axiosGet, axiosPost } from "utils/api";

function ExpandedRow(props) {
  // const { domain, vendor, team, market, refetch } = props;
  const toast = useToast();
  const [expandedRows, setExpandedRows] = useState([]);

  function handleVendorSelect(value) {
    axiosPost(updateDomainApi, {
      vendor: value,
      domain: domain,
    });

    toast({
      title: "Thành Công",
      // description: "We've created your account for you.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    fetchData();
  }

  const fetchData = () => {
    // Your data fetching logic here
    // setData(newData);
    props.refetch();
  };

  function handleMarketSelect(value) {
    axiosPost(updateDomainApi, {
      market: value,
      domain: domain,
    });

    toast({
      title: "Thành Công",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    refetch;
    fetchData();
  }

  useEffect(() => {}, []);

  const toggleRow = (id) => {
    if (expandedRows.includes(id)) {
      setExpandedRows(expandedRows.filter((rowId) => rowId !== id));
    } else {
      setExpandedRows([...expandedRows, id]);
    }
  };

  return (
    <>
      <Collapse in={true}>
        <Flex justify="space-between">
          <Spacer p="10px" />
          <Box
            p="20px"
            color="white"
            mt="4"
            flex="1.5"
            bg="#80bfff"
            rounded="md"
            shadow="md"
          >
            <Text fontSize="md" fontWeight="bold">
              Update Match :
            </Text>
            <Text fontSize="sm" fontWeight="normal">
              type :
            </Text>
          </Box>
        </Flex>
      </Collapse>
    </>
  );
}

export default ExpandedRow;
