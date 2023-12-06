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
import DomainTableRow from "components/Domain/DomainTableRow";
import DomainRow from "components/Domain/DomainRow";
import React, { useState, useEffect } from "react";
import { checkLogin, logout, getToken } from "../../../utils/authentication";
import { API_ROUTES , ROOT_API } from "utils/constant";
import axios from "axios";

import { axiosGet } from "utils/api";

import AddDomainDialog from "components/Domain/AddDomainDialog";
import { TablePagination } from "@trendmicro/react-paginations";
import { initialFilter } from "utils/constant";
import EditDomainDialog from "components/Domain/EditDomainDialog"; 
const vendorDomain = [
  { value: "vendor1", color: "blue" },
  { value: "vendor2", color: "green" },
];


const Domain = () => {
  const [filter, setFilter] = useState(initialFilter);
  const xToken = getToken();
 
  const domainApi = ROOT_API + API_ROUTES.DOMAIN_API ;
  
  const [{ data, loading, error }, refetch] = useAxios({
    url: domainApi,
    params: { ...filter },
  });
  const domain = data?.data


const textColor = useColorModeValue("gray.700", "white");
const borderColor = useColorModeValue("gray.200", "gray.600");
const [userDetail, setUserDetail] = useState();



const { isOpen, onOpen, onClose } = useDisclosure();
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
                {domain?.map((row, index, arr) => (
                  <DomainRow
                    key={row._id}
                    data={domain}
                    _id={row._id}
                    ApiKey={row.api_key}
                    name={row.name}
                    ip={row.ip}
                    zone_id={row.zone_id}
                    refetch = {refetch}
                    onClick={() => handleEditClick(row)}
                  />
                  ))}
              </Tbody>
            

          </Table>
          {isEditModalOpen && (
            <EditDomainDialog
              refetch={refetch}
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
      refetch={refetch}
      isOpen={isRegisterOpen}
      userDetail={userDetail}
      onOpen={onRegisterOpen}
      onClose={handelCloseModal}
    />
    }
  </>
  )
}

export default Domain;