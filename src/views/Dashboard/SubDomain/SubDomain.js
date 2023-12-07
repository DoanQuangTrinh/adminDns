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
  useToast,

} from "@chakra-ui/react";
import useAxios from "axios-hooks";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import React, { useState, useEffect } from "react";
import { checkLogin, logout, getToken } from "../../../utils/authentication";
import axios from "axios";
import { axiosGet,axiosPost } from "utils/api";
import AddSubDomain from "components/SubDomain/AddSubDomain";
import { TablePagination } from "@trendmicro/react-paginations";
import { initialFilter } from "utils/constant";
import EditSubDomain from "components/SubDomain/EditSubDomain";
import SubDomainRow from "components/SubDomain/SubDomainRow";
import { API_ROUTES , ROOT_API } from "utils/constant";

const vendorDomain = [
  { value: "vendor1", color: "blue" },
  { value: "vendor2", color: "green" },
];
const xToken = getToken();

const SubDomain = ({id}) => {
  const toast = useToast();

  const CreateSubDomain = process.env.REACT_APP_API_HOST + process.env.REACT_APP_API_CREATE_SUBDOMAIN;
  const clickCreateButton = async () => {
    const subData = {
      domain_id: id,
      linkRedirect: "facebook.com",
      quantity: 1
    };
    try {
      const response = await axiosPost(
        CreateSubDomain,
        subData
      );
      if (response.data.code === 0) {
        toast({
          title: response.data.msg,
          status: "success",
          duration: 9000,
        })
        // setSelectedId(id);
        refetch();
        onClose();
      } else {
        toast({
          title: response.data.msg,
          status: "error",
          duration: 9000,
        })
      }
    } catch (error) {
      toast({
        title:
          error?.response?.data?.errors?.errors[0]?.msg ||
          error?.response?.data?.msg || "Create Sub Domain Fail",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };
  console.log(id)
  const [filter, setFilter] = useState(initialFilter);
  // const subDomainApi = ROOT_API + API_ROUTES.SUBDOMAIN_API ;
  const subDomainApi = process.env.REACT_APP_API_HOST + process.env.REACT_APP_API_CREATE_SUBDOMAIN;
  const [{ data, loading, error }, refetch] = useAxios({
    // url: `${subDomainApi}/${id}`,
    params: filter,
  });
  const subDomain = data?.data

const textColor = useColorModeValue("gray.700", "white");
const borderColor = useColorModeValue("gray.200", "gray.600");
const [userDetail, setUserDetail] = useState();



const { isOpen, onOpen, onClose } = useDisclosure();
const isRegisterOpen = isOpen;
const onRegisterOpen = onOpen;
const onRegisterClose = onClose;

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
              {subDomain?.map((row, index, arr) => {
                return (
                  <SubDomainRow
                    key={index}
                    domain={row.domain}
                    link={row.link}
                    id={row._id}
                    type={row.type}
                    zone_id={row.zone_id}
                    onClose={onClose}
                    refetch={refetch}
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
            />
          )}
          <Table/>
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
      clickCreateButton = {clickCreateButton}
      refetch={refetch}
      isOpen={isRegisterOpen}
      userDetail={userDetail}
      onOpen={onRegisterOpen}
      onClose={handelCloseModal}
    />}
  </>
  )
}

export default SubDomain;