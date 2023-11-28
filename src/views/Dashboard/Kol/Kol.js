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
import React, { useState, useEffect } from "react";
import KolRow from "components/Kol/KolRow";
import KolRegisterDialog from "components/Kol/KolRegisterDialog";
import { TablePagination } from "@trendmicro/react-paginations";
import { initialFilter } from "utils/constant";

const kolApi = process.env.REACT_APP_API_HOST + process.env.REACT_APP_KOLS;

function Kol() {
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const [filter, setFilter] = useState(initialFilter)
  const {
    isOpen: isRegisterOpen,
    onOpen: onRegisterOpen,
    onClose: onRegisterClose,
  } = useDisclosure();

  const [{ data, loading, error }, refetch] = useAxios({
    url: kolApi,
    params: filter
  });

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
        <CardHeader p="6px 0px 22px 0px">
          <Text fontSize="xl" color={textColor} fontWeight="bold">
            Kols
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
          <KolRegisterDialog
            isOpen={isRegisterOpen}
            onOpen={onRegisterOpen}
            onClose={onRegisterClose}
            fetchData={refetch}
            // data={rowDomain}
          />
          <Table variant="simple" color={textColor}>
            <Thead>
              <Tr my=".8rem" pl="0px" color="gray.400">
                <Th pl="0px" borderColor={borderColor} color="gray.400">
                  avatar
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Name
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Email
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Phone
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Status
                </Th>
                <Th borderColor={borderColor}></Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.kols?.map((row, index, arr) => {
                return (
                  <KolRow
                    name={row.name}
                    avatar={row.avatar}
                    status={row.status}
                    email={row.email}
                    phone={row.phone}
                    id={row._id}
                    isLast={index === arr.length - 1 ? true : false}
                    fetchData={refetch}
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
  );
}

export default Kol;
