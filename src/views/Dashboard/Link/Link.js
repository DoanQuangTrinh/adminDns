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
import LinkRow from "components/Link/LinkRow";
import React, { useEffect, useState } from "react";
import useAxios from "axios-hooks";
import { checkLogin, logout, getToken } from "../../../utils/authentication";
import AddLinkDialog from "components/Link/AddLinkDialog";
import { TablePagination } from "@trendmicro/react-paginations";
import { initialFilter } from "utils/constant";

const domainsApi = process.env.REACT_APP_API_HOST + process.env.REACT_APP_LINKS;

function Link() {
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const xToken = getToken();
  const [links, setLinks] = React.useState([]);
  const [filter, setFilter] = useState(initialFilter);

  const [{ data, loading, error }, refetch] = useAxios({
    url: domainsApi,
    headers: {
      xToken,
    },
    params: filter
  });

  const {
    isOpen: isAddLinkOpen,
    onOpen: onAddLinkOpen,
    onClose: onAddLinkClose,
  } = useDisclosure();

  const fetchData = () => {
    refetch();
  };

  useEffect(() => {
    if (data == undefined) {
      refetch;
    }
    setLinks(data?.data);
  }, [data, setLinks]);

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
        <CardHeader p="6px 0px 22px 0px">
          <Text fontSize="xl" color={textColor} fontWeight="bold">
            Links Table
          </Text>
          <Button
            variant="primary"
            maxH="30px"
            m="10px"
            onClick={onAddLinkOpen}
          >
            Add
          </Button>
        </CardHeader>
        <AddLinkDialog
          isOpen={isAddLinkOpen}
          onOpen={onAddLinkOpen}
          onClose={onAddLinkClose}
          fetchData={refetch}
          // data={props}
        />
        <CardBody>
          <Table variant="simple" color={textColor}>
            <Thead>
              <Tr my=".8rem" pl="0px" color="gray.400">
                <Th pl="0px" borderColor={borderColor} color="gray.400">
                  Name
                </Th>
                <Th pl="0px" borderColor={borderColor} color="gray.400">
                  URL
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Loop
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Order
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Status
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Time
                </Th>
                <Th borderColor={borderColor}></Th>
              </Tr>
            </Thead>
            <Tbody>
              {links?.map((row, index, arr) => {
                return (
                  <LinkRow
                    _id={row._id}
                    logo={row.logo}
                    name={row.name}
                    url={row.url}
                    loop={row.loop}
                    order={row.order}
                    status={row.status}
                    timer={row.timer}
                    isLast={index === arr.length - 1 ? true : false}
                    key={index}
                    refetch={refetch}
                    row={row}
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

export default Link;
