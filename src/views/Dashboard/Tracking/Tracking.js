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
   
    // const domainApi = ROOT_API + API_ROUTES.DOMAIN_API ;
    const location = useLocation();
    const spliceSubDomain = location.pathname.match(/\/subDomain\/([^/]+)\//);
    const subDomainId = spliceSubDomain[1]
    const subDomainApi = process.env.REACT_APP_API_HOST + process.env.REACT_APP_FL_TRACKING
    const [{ data, loading, error }, refetch] = useAxios({
      url: `${subDomainApi}/${subDomainId}`,
    });
    const domain = data?.data
    console.log(data)
    
  
    const textColor = useColorModeValue("gray.700", "white");
    const borderColor = useColorModeValue("gray.200", "gray.600");
  
  
  
    const isRegisterOpen = isOpen;
    const onRegisterOpen = onOpen;
    const onRegisterClose = onClose;
  
  
    const isLoggedIn = checkLogin();
  
    const handelUpdateUser = userDetail => {
        setUserDetail(userDetail)
        onRegisterOpen()
    }
    
    
    const handelCloseModal = () => {
        setUserDetail()
        onRegisterClose()
    }
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const handleEditClick = (row) => {
        setSelectedRow(row);
        setIsEditModalOpen(true);
    };
    const handleUpdate = (updatedData) => {
        setData(Array.isArray(updatedData) ? updatedData : [updatedData]);
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
                  Benedict
                  </Th>
                  <Th borderColor={borderColor} color="gray.400">
                  Name
                  </Th>
                  <Th borderColor={borderColor} color="gray.400">
                  Journey
                  </Th>
                  <Th borderColor={borderColor} color="gray.400">
                  Status
                  </Th>
                  <Th borderColor={borderColor}></Th>
                </Tr>
              </Thead>
              <Tbody>
                  {/* {domain?.map((row, index, arr) => (
                    <DomainRow
                      key={row._id}
                      data={domain}
                      _id={row._id}
                      benedict={row.benedict}
                      name={row.name}
                      journey={row.journey}
                      status={row.status}
                      refetch = {refetch}
                      onClick={() => handleEditClick(row)}
                    />
                    ))} */}
                </Tbody>
            </Table>
            <Flex justifyContent={"flex-end"}>
              <TablePagination
                  type="full"
                  page={data?.pagination?.page}
                  pageLength={data?.pagination?.pageSize}
                  totalRecords={data?.pagination?.count}
                  onPageChange={({ page, pageLength }) => {
                    console.log(page);
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