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
  // Custom components
  import useAxios from "axios-hooks";
  import Card from "components/Card/Card.js";
  import CardBody from "components/Card/CardBody.js";
  import CardHeader from "components/Card/CardHeader.js";
  import DomainTableRow from "components/Domain/DomainTableRow";
  import DomainRow from "components/Domain/DomainRow";
  import React, { useState, useEffect } from "react";
  import { checkLogin, logout, getToken } from "../../../utils/authentication";
  import axios from "axios";
  import { useDataContext } from "context/UserContext";

  import { axiosGet } from "utils/api";
  
  import AddDomainDialog from "components/Domain/AddDomainDialog";
  import { TablePagination } from "@trendmicro/react-paginations";
  import { initialFilter } from "utils/constant";
  import EditDomainDialog from "components/Domain/EditDomainDialog"; 
  const vendorDomain = [
    { value: "vendor1", color: "blue" },
    { value: "vendor2", color: "green" },
  ];
const userApi = process.env.REACT_APP_API_HOST + process.env.REACT_APP_DOMAINS;
const xToken = localStorage.getItem('xToken');
// const { data, refetchData } = useDataContext();

console.log(userApi)
const Domain = () => {
  // const { data, refetchData } = useDataContext();

  // Do something with the data

    // const [{data , loading , error} , refetch] = useAxios({
    //   url : userApi,
    //   method: 'GET'
    // })
    // console.log(data)
    // Trigger a refetch of data
    // refetchData();
  // const [data , setData] = useState([]);
  // const fetchDomainData = async () => {
  //   try {
  //     const response = await axiosGet(
  //       userApi
  //     )
  //     setData(Array.isArray(response.data.data) ? response.data.data : [response.data.data]);
  //   }
  //   catch(err){
  //     console.log(err)
  //   }
  // }
  // useEffect(() => {
  //   fetchDomainData();
  // }, []); 
  // console.log(data._id)
    // refetchData();
  // useEffect(() => {
  //   fetchDomainData();
  // }, []);
    const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const [filter, setFilter] = useState(initialFilter);
  const [userDetail, setUserDetail] = useState();

  const xToken = getToken();

  const {
    isOpen: isRegisterOpen,
    onOpen: onRegisterOpen,
    onClose: onRegisterClose,
  } = useDisclosure();

  // const [domain, setDomain] = useState([]);

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
              Domain
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
                  ApiKey
                  </Th>
                  <Th borderColor={borderColor} color="gray.400">
                  Name
                  </Th>
                  <Th borderColor={borderColor} color="gray.400">
                  IP
                  </Th>
                  <Th borderColor={borderColor} color="gray.400">
                  Zone_Id
                  </Th>
                  <Th borderColor={borderColor}></Th>
                </Tr>
              </Thead>
              <Tbody>
                  {data?.map((row, index, arr) => (
                    <DomainRow
                      key={row._id} // Đặt key để đảm bảo tính duy nhất trong mảng
                      data={data}
                      _id={row._id}
                      ApiKey={row.api_key}
                      name={row.name}
                      ip={row.ip}
                      zone_id={row.zone_id}
                      onClick={() => handleEditClick(row)}
                      refetch={fetchDomainData}
                    />
                    ))}
                    {/* {data?.map((row, index, arr) => (
                    <AddDomainDialog 
                    data={data}
                    refetch={fetchDomainData} 
                  /> */}
                  {/* ))} */}
                </Tbody>
                  

            </Table>
            {isEditModalOpen && (
              <EditDomainDialog
                refetch={fetchDomainData} 

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
      {isRegisterOpen && <AddDomainDialog
        isOpen={isRegisterOpen}
        userDetail={userDetail}
        onOpen={onRegisterOpen}
        onClose={handelCloseModal}
        // fetchData={refetch}
      // data={rowDomain}
      />}
    </>
    )
}

export default Domain;