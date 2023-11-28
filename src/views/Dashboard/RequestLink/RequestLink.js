// Chakra imports
import {
  Flex,
  Table,
  Button,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import React, { useEffect, useState } from "react";
import { tablesTableData } from "variables/general";
import useAxios from "axios-hooks";
import { getToken } from "utils/authentication";
import RequestLinkTableRow from "components/RequestLink/RequestLinkTableRow";
import { TablePagination } from "@trendmicro/react-paginations";
import { initialFilter } from "utils/constant";

const requestLinkApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_REQUEST_LINKS;

function RequestLink() {
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const xToken = getToken();
  const [filter, setFilter] = useState(initialFilter);

  const [{ data, loading, error }, refetch] = useAxios({
    url: requestLinkApi,
    headers: {
      xToken,
    },
    params: filter
  });

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
        <CardHeader p="6px 0px 22px 0px">
          <Text fontSize="xl" color={textColor} fontWeight="bold">
            Request Links Table
          </Text>
        </CardHeader>
        <CardBody>
          <Table variant="simple" color={textColor}>
            <Thead>
              <Tr my=".8rem" pl="0px" color="gray.400">
                <Th borderColor={borderColor} color="gray.400">
                  Name
                </Th>
                <Th pl="0px" borderColor={borderColor} color="gray.400">
                  Url
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Created By
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Status
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Created At
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Action
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.data?.length
                ? data?.data?.map((row, index, arr) => {
                    return (
                      <RequestLinkTableRow
                        row={row}
                        isLast={index === arr.length - 1 ? true : false}
                        key={index}
                        fetchData={() => refetch()}
                      />
                    );
                  })
                : ""}
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
  );
}

export default RequestLink;
