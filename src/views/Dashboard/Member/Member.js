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
import MemberRow from "components/Member/MemberRow";
import React, { useState, useEffect } from "react";
import Loading from "components/Layout/Loading";
import { checkLogin, logout, getToken } from "../../../utils/authentication";
import { TablePagination } from "@trendmicro/react-paginations";
import { initialFilter } from "utils/constant";

const memberApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_MEMBERS;

function Member() {
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const xToken = getToken();

  const [members, setMembers] = useState([]);
  const [filter, setFilter] = useState(initialFilter);
  const isLoggedIn = checkLogin();

  const [{ data, loading, error }, refetch] = useAxios({
    url: memberApi,
    headers: {
      xToken,
    },
    params: filter,
  });

  useEffect(() => {
    if (!isLoggedIn) {
      return history.push("/auth/signin");
    }
    if (data == undefined) {
      refetch;
    }
    setMembers(data?.data);
  }, [isLoggedIn, data, setMembers]);

  //Handle Error
  useEffect(() => {
    if (error) {
      const { status } = error.response;
      return <Loading />;
    }
  }, [error]);

  const getDay = (date) => {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    return day + "/" + month + "/" + year;
  };

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
        <CardHeader p="6px 0px 22px 0px">
          <Text fontSize="xl" color={textColor} fontWeight="bold">
            Members
          </Text>
        </CardHeader>
        <CardBody>
          {loading ? (
            <Loading />
          ) : (
            <>
              <Table variant="simple" color={textColor}>
                <Thead>
                  <Tr my=".8rem" pl="0px" color="gray.400">
                    <Th pl="0px" borderColor={borderColor} color="gray.400">
                      Date
                    </Th>
                    <Th pl="0px" borderColor={borderColor} color="gray.400">
                      Username
                    </Th>
                    <Th borderColor={borderColor} color="gray.400">
                      Email
                    </Th>
                    <Th borderColor={borderColor} color="gray.400">
                      Status
                    </Th>
                    <Th borderColor={borderColor}></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {members?.map((row, index, arr) => {
                    return (
                      <MemberRow
                        date={getDay(row.createdAt)}
                        username={row.username}
                        email={row.emailGoogle}
                        status={row.status}
                        refetch={refetch}
                        isLast={index === arr.length - 1 ? true : false}
                      />
                    );
                  })}
                </Tbody>
              </Table>
              <Flex justifyContent="flex-end">
                <TablePagination
                  type="full"
                  page={data?.pagination?.page}
                  pageLength={data?.pagination?.pageSize}
                  totalRecords={data?.pagination?.count}
                  onPageChange={({ page, pageLength }) => {
                    console.log(page)
                    setFilter({
                      ...filter,
                      pageSize: pageLength,
                      pageIndex: page - 1
                    })
                  }}
                  prevPageRenderer={() => <i className="fa fa-angle-left" />}
                  nextPageRenderer={() => <i className="fa fa-angle-right" />}
                />
              </Flex>
            </>
          )}
        </CardBody>
      </Card>
    </Flex>
  );
}

export default Member;
