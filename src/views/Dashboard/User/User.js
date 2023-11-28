// Chakra imports
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
import UserRow from "components/User/UserRow";
import React, { useState, useEffect } from "react";
import { checkLogin, logout, getToken } from "../../../utils/authentication";

const userApi = process.env.REACT_APP_API_HOST + process.env.REACT_APP_USERS;
import UserRegisterDialog from "components/User/UserRegisterDialog";
import { TablePagination } from "@trendmicro/react-paginations";
import { initialFilter } from "utils/constant";

function User() {
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

  const [users, setUsers] = useState([]);

  const isLoggedIn = checkLogin();

  const [{ data, loading, error }, refetch] = useAxios({
    url: userApi,
    headers: {
      xToken,
    },
    params: filter
  });

  useEffect(() => {
    if (data == undefined) {
      refetch;
    }
    setUsers(data?.data);
  }, [data, setUsers]);

  const handelUpdateUser = userDetail => {
    setUserDetail(userDetail)
    onRegisterOpen()
  }

  
  const handelCloseModal = () => {
    setUserDetail()
    onRegisterClose()
  }


  return (
    <>
      <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
        <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
          <CardHeader p="6px 0px 22px 0px">
            <Text fontSize="xl" color={textColor} fontWeight="bold">
              Users
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
                    Name
                  </Th>
                  <Th borderColor={borderColor} color="gray.400">
                    Phone
                  </Th>
                  <Th borderColor={borderColor} color="gray.400">
                    Level
                  </Th>
                  <Th borderColor={borderColor} color="gray.400">
                    Status
                  </Th>
                  <Th borderColor={borderColor}></Th>
                </Tr>
              </Thead>
              <Tbody>
                {users?.map((row, index, arr) => {
                  return (
                    <UserRow

                      name={row.username}
                      id={row._id}
                      email={row.email}
                      phone={row.phone}
                      role={row.role}
                      isLast={index === arr.length - 1 ? true : false}
                      userDetail={row}
                      refetch={refetch}
                      handelUpdateUser={handelUpdateUser}
                    />
                  );
                })}
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
      {isRegisterOpen && <UserRegisterDialog
        isOpen={isRegisterOpen}
        userDetail={userDetail}
        onOpen={onRegisterOpen}
        onClose={handelCloseModal}
        fetchData={refetch}
      // data={rowDomain}
      />}
    </>
  );
}

export default User;
