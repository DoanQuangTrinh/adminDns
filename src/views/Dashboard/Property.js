// Chakra imports
import {
  Flex,
  Table,
  Tbody,
  Text,
  Th,
  Button,
  Select,
  Input,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import PropertyTableRow from "components/Property/PropertyTableRow";
import useAxios from "axios-hooks";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { checkLogin, logout, getToken } from "../../utils/authentication";
import AddPropertyDialog from "components/Property/AddPropertyDialog";
import { propertyCatagory } from "../../config/config";
import { groupCatagory } from "../../config/config";
import Pagination from "./Pagination";
// import filteredData from "./filteredData";

const propertiesAPI =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_PROPERTIES;

const asyncPropertiesAPI =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_ASYNC_PROPERTY;

function Property() {
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const inputBg = useColorModeValue("#ccf5ff", "navy.800");
  const xToken = getToken();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [properties, setProperties] = useState([]);

  const [filterText, setFilterText] = useState("");

  const filteredData = properties?.filter((item) =>
    item.propertyId.toLowerCase().includes(filterText.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData?.slice(indexOfFirstItem, indexOfLastItem);

  const {
    isOpen: isAddPropertyOpen,
    onOpen: onAddPropertyOpen,
    onClose: onAddPropertyClose,
  } = useDisclosure();

  const [{ data, loading, error }, refetch] = useAxios({
    url: propertiesAPI,
    headers: {
      xToken,
    },
  });

  useEffect(() => {
    if (data == undefined) {
      refetch;
    }
    setProperties(data?.data);
    console.log("======data======> " + data);
  }, [data, setProperties]);

  const asyncPropertiesButton = async () => {
    await axios.get(asyncPropertiesAPI);

    // onClose();
  };

  /* // propertyId={row.propertyId}
  //                   propertyName={row.propertyName}
  //                   Category={row.Category}
  //                   status = {row.status} */

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
        <CardHeader p="6px 0px 22px 0px" justify="space-between">
          <Text fontSize="xl" color={textColor} fontWeight="bold">
            Properties Managerment
          </Text>

          <Flex>
            <Button
              variant="primary"
              maxH="30px"
              maxW="100px"
              m="10px"
              onClick={onAddPropertyOpen}
            >
              Add
            </Button>
            <Button
              variant="primary"
              maxH="30px"
              m="10px"
              onClick={asyncPropertiesButton}
            >
              Async
            </Button>
            <Select
              m="10px"
              onChange={(e) => {
                // setStatus(e.target.value);
                console.log("======data======> " + e.target.value);
              }}
            >
              {propertyCatagory.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.value}
                </option>
              ))}
            </Select>
            <Select
              m="10px"
              onChange={(e) => {
                // setStatus(e.target.value);
                console.log("======data======> " + e.target.value);
              }}
            >
              {groupCatagory.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.value}
                </option>
              ))}
            </Select>
            <Input
              m="10px"
              variant="search"
              onChange={(e) => setFilterText(e.target.value)}
              fontSize="xs"
              bg={inputBg}
              placeholder="Type here..."
            />
          </Flex>
        </CardHeader>
        <AddPropertyDialog
          isOpen={isAddPropertyOpen}
          onOpen={onAddPropertyOpen}
          onClose={onAddPropertyClose}
          // tool={name}
          // data={props}
        />
        <CardBody>
          <Table variant="simple" color={textColor}>
            <Thead>
              <Tr my=".8rem" pl="0px" color="gray.400">
                <Th pl="0px" borderColor={borderColor} color="gray.400">
                  propertyId
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  propertyName
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Category
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Status
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Edit
                </Th>
                <Th borderColor={borderColor}></Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentItems?.map((row, index, arr) => {
                return (
                  <PropertyTableRow
                    propertyId={row.propertyId}
                    propertyName={row.propertyName}
                    Category={row.Category}
                    status={row.status}
                    isLast={index === arr.length - 1 ? true : false}
                    key={index}
                  />
                );
              })}
            </Tbody>
          </Table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </CardBody>
      </Card>
    </Flex>
  );
}

export default Property;
