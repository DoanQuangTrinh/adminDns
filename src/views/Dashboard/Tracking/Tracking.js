import {
    Button,
    Flex,
    Table,
    Tbody,
    Text,
    Th,
    Thead,
    Tr,
    useColorModeValue,
    useDisclosure,
  } from "@chakra-ui/react";
  import useAxios from "axios-hooks";
  import Card from "components/Card/Card.js";
  import CardBody from "components/Card/CardBody.js";
  import CardHeader from "components/Card/CardHeader.js";
  import ListTracking from "components/Tracking/ListTracking";
  import React, { useState, useEffect } from "react";
  import { checkLogin, logout, getToken } from "../../../utils/authentication";
  import { API_ROUTES , ROOT_API } from "utils/constant";
  import { TablePagination } from "@trendmicro/react-paginations";
  import { initialFilter } from "utils/constant";
  import { useLocation } from "react-router-dom";
  
  
  const Tracking = () => {
    const [filter, setFilter] = useState(initialFilter);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const trackingApi = ROOT_API + API_ROUTES.LIST_TRACKING ;
    const location = useLocation();
    const spliceSubDomain = location.pathname.match(/\/subDomain\/([^/]+)\//);
    const subDomainId = spliceSubDomain[1]
    const [{ data, loading, error }, refetch] = useAxios({
      url: `${trackingApi}/${subDomainId}`,
    });
    const tracking = data?.data
    console.log(`${trackingApi}/${subDomainId}`)
    const textColor = useColorModeValue("gray.700", "white");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const isRegisterOpen = isOpen;
    const onRegisterOpen = onOpen;
    const onRegisterClose = onClose;
    const isLoggedIn = checkLogin();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const handleEditClick = (row) => {
        setSelectedRow(row);
        setIsEditModalOpen(true);
    };
    
    return (
        <>
      <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
        <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
          <CardHeader p="6px 0px 22px 0px">
            <Text fontSize="xl" color={textColor} fontWeight="bold">
              Tracking
            </Text>
            <Button
              variant="primary"
              maxH="30px"
              m="10px"
              onClick={onRegisterOpen}
            >
              Add
            </Button>
          </CardHeader>
          <CardBody>
  
            <Table variant="simple" color={textColor}>
              <Thead>
                <Tr my=".8rem" pl="0px" color="gray.400">
                  <Th pl="0px" borderColor={borderColor} color="gray.400">
                  ID
                  </Th>
                  <Th borderColor={borderColor} color="gray.400">
                  Subdomain
                  </Th>
                  <Th borderColor={borderColor} color="gray.400">
                  IP
                  </Th>
                  <Th borderColor={borderColor} color="gray.400">
                  Nation
                  </Th>
                  <Th borderColor={borderColor}></Th>
                </Tr>
              </Thead>
              <Tbody>
                  {tracking?.map((row, index, arr) => (
                    <ListTracking
                      key={row._id}
                      id={row._id}
                      subdomain={row.subdomain}
                      ip={row.ip}
                      nation={row.nation}
                      refetch = {refetch}
                      onClick={() => handleEditClick(row)}
                    />
                    ))}
                </Tbody>
            </Table>
            <Flex justifyContent={"flex-end"}>
              <TablePagination
                  type="full"
                  page={data?.pagination?.page}
                  pageLength={data?.pagination?.pageSize}
                  totalRecords={data?.pagination?.count}
                  onPageChange={({ page, pageLength }) => {
                    setFilter({
                      ...filter,
                      pageSize: pageLength,
                      pageIndex: page - 1,
                    });
                  }}
                  prevPageRenderer={() => <i className="fa fa-angle-left" />}
                  nextPageRenderer={() => <i className="fa fa-angle-right" />}
                />
            </Flex>
          </CardBody>
        </Card>
      </Flex>
    </>
    )
  }
  
  export default Tracking;