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
  import Card from "components/Card/Card.js";
  import CardBody from "components/Card/CardBody.js";
  import CardHeader from "components/Card/CardHeader.js";
  import React, { useState, useEffect } from "react";
  import { checkLogin, logout, getToken } from "../../../utils/authentication";
  import axios from "axios";
  import { axiosGet } from "utils/api";
  import AddSubDomain from "components/SubDomain/AddSubDomain";
  import { TablePagination } from "@trendmicro/react-paginations";
  import { initialFilter } from "utils/constant";
  import EditSubDomain from "components/SubDomain/EditSubDomain";
  import SubDomainRow from "components/SubDomain/SubDomainRow";
  const vendorDomain = [
    { value: "vendor1", color: "blue" },
    { value: "vendor2", color: "green" },
  ];
  const xToken = getToken();
const userApi = process.env.REACT_APP_API_HOST + process.env.REACT_APP_API_CREATE_SUBDOMAIN;
// const xToken = localStorage.getItem('xToken');
console.log(userApi)
const SubDomain = ({onClose}) => {
  const [data , setData] = useState([]);
  // const fetchDomainData = async () => {
  //   try {
  //     const headers = {
  //       'Content-Type': 'application/json',
  //       'xToken': xToken,
  //     };
  //     const response = await axios.get(userApi);
  //   setData(Array.isArray(response.data.data) ? response.data.data : [response.data.data]);
  // } catch (error) {
  //   console.error('Error fetching domain data:', error);
  // }}
  // useEffect(() => {
  //   fetchDomainData();
  // }, []);

  const fetchSubDomain = async () => {
    try{
      const response = await axiosGet(
        userApi
      )
      setData(Array.isArray(response.data.data) ? response.data.data : [response.data.data]);
      if (response?.data?.code == 0) {
        onClose();
      }
    }
    catch (err) {
      console.log(err)
    }
    await refetch();
  }
  useEffect(() => {
    fetchSubDomain();
    }, []); 
  
  console.log(data)
    const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const [filter, setFilter] = useState(initialFilter);
  const [userDetail, setUserDetail] = useState();

 

  const {
    isOpen: isRegisterOpen,
    onOpen: onRegisterOpen,
    onClose: onRegisterClose,
  } = useDisclosure();

  const [domain, setDomain] = useState([]);

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
    console.log("Updated data:", updatedData);
    setData(Array.isArray(updatedData) ? updatedData : [updatedData]);
  };
  
    return (
        <>
      <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
        <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
          <CardHeader p="6px 0px 22px 0px">
            <Text fontSize="xl" color={textColor} fontWeight="bold">
              SubDomain
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
                  domain id
                  </Th>
                  <Th borderColor={borderColor} color="gray.400">
                  link
                  </Th>
                  <Th borderColor={borderColor} color="gray.400">
                  id
                  </Th>
                  <Th borderColor={borderColor} color="gray.400">
                  type
                  </Th>
                  <Th borderColor={borderColor}></Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((row, index, arr) => {
                  return (
                    <SubDomainRow
                      key={index}
                      domain={row.domain}
                      link={row.link}
                      id={row._id}
                      type={row.type}
                      zone_id={row.zone_id}
                      onClose = {onClose}
                      onClick={() => handleEditClick(row)}
                    />
                  );
                })}
              </Tbody>
            </Table>
            {isEditModalOpen && (
              <EditSubDomain
                isOpen={isEditModalOpen}
                initialData={selectedRow}
                onUpdate={handleUpdate}
                onClose={() => setIsEditModalOpen(false)}
              />)}
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
      {isRegisterOpen && <AddSubDomain
        isOpen={isRegisterOpen}
        userDetail={userDetail}
        onOpen={onRegisterOpen}
        onClose={handelCloseModal}
      />}
    </>
    )
}

export default SubDomain;