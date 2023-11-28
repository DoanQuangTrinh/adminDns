// Chakra imports
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Select,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import useAxios from "axios-hooks";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import React, { useState, useMemo, Fragment } from "react";
import Loading from "components/Layout/Loading";
import { TablePagination } from "@trendmicro/react-paginations";
import "@trendmicro/react-paginations/dist/react-paginations.css";
import MatchRow from "components/SelectedMatches/MatchRow";
import { initialFilter } from "utils/constant";
import { ROOT_API } from "utils/constant";
import { API_ROUTES } from "utils/constant";
import { today } from "utils/helpers";
import WeekFilter from "../WeekFilter/WeekFilter";
import LeagueFilter from "components/LeagueFilter/LeagueFilter";

const kolApi = process.env.REACT_APP_API_HOST + process.env.REACT_APP_KOLS;
const cdnLinkApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_CDN_LINKS;

const initialMatchesFilter = {
  ...initialFilter,
  status: undefined,
};
function SelectedMatches() {
  const bgColor = useColorModeValue("blue.200", "white");
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const [filter, setFilter] = useState({
    ...initialMatchesFilter,
    date: today,
  });
  const [{ data, loading, error }, refetch] = useAxios(
    {
      url: ROOT_API + API_ROUTES.LIVE_MATCHES,
      params: filter,
    },
    {
      useCache: false,
    }
  );

  const [{ data: dataKols }] = useAxios(
    {
      url: kolApi,
    },
    {
      useCache: false,
    }
  );

  const [{ data: cndLinks }] = useAxios(
    {
      url: cdnLinkApi,
    },
    {
      useCache: false,
    }
  );

  // const [status, setStatus] = useState(undefined);

  const onFilterMatch = (dataFilter) => {
    setFilter({
      ...filter,
      pageIndex: 0,
      date: dataFilter,
      // status
    });
    // refetch();
    // setCurrentPage(1);
  };

  const onFilterLeague = (dataFilter) => {
    setFilter({
      ...filter,
      pageIndex: 0,
      league_id: dataFilter,
    });
  };
  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
        <CardHeader p="6px 0px 22px 0px">
          <Text fontSize="xl" color={textColor} fontWeight="bold">
            Livestream Matches
          </Text>
        </CardHeader>
        <CardBody>
          {loading ? (
            <Loading />
          ) : (
            <Stack overflow={"auto"}>
              <WeekFilter onFilterMatch={onFilterMatch} filterProps={filter} />
              <LeagueFilter
                onFilterLeague={onFilterLeague}
                filterProps={filter}
              />
              <Stack overflow={"auto"}>
                <Table variant="simple" color={textColor}>
                  <Thead bg={bgColor} hidden>
                    <Tr my=".8rem" pl="0px" color={textColor}>
                      <Th borderColor={borderColor} color={textColor}>
                        League
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data?.matches?.length
                      ? data.matches.map((row, index, arr) => {
                          return (
                            <Fragment key={index}>
                              <Tr>
                                <Td
                                  borderColor={borderColor}
                                  borderBottom={
                                    index === arr.length - 1 ? "none" : null
                                  }
                                  // colSpan={6}
                                  bg={borderColor}
                                >
                                  <Text
                                    fontSize="md"
                                    color={textColor}
                                    fontWeight="bold"
                                  >
                                    {row.league_name}
                                  </Text>
                                </Td>
                              </Tr>
                              <Tr>
                                <Td px={0} py={0}>
                                  <Table>
                                    <Thead>
                                      <Tr
                                        py="1rem"
                                        pl="0px"
                                        color={textColor}
                                        bg={bgColor}
                                      >
                                        <Th
                                          borderColor={borderColor}
                                          color={textColor}
                                        >
                                          ID Match
                                        </Th>
                                        <Th
                                          borderColor={borderColor}
                                          color={textColor}
                                        >
                                          Home Team / Away Team
                                        </Th>
                                        <Th
                                          borderColor={borderColor}
                                          color={textColor}
                                        >
                                          Time
                                        </Th>
                                        <Th
                                          borderColor={borderColor}
                                          color={textColor}
                                        >
                                          Status
                                        </Th>
                                        <Th
                                          borderColor={borderColor}
                                          color={textColor}
                                        >
                                          Result
                                        </Th>
                                        <Th
                                          borderColor={borderColor}
                                          color={textColor}
                                        >
                                          Livestream Match
                                        </Th>
                                        <Th
                                          borderColor={borderColor}
                                          color={textColor}
                                        >
                                          Feature Match
                                        </Th>
                                        <Th
                                          borderColor={borderColor}
                                          color={textColor}
                                        >
                                          Add Commentator
                                        </Th>
                                        <Th
                                          borderColor={borderColor}
                                          color={textColor}
                                        >
                                          Action
                                        </Th>
                                      </Tr>
                                    </Thead>
                                    {row?.matches?.length
                                      ? row.matches.map(
                                          (row_child, _index, _arr) => (
                                            <Tbody key={row_child._id}>
                                              <MatchRow
                                                data={row_child}
                                                fetchData={refetch}
                                                isLast={
                                                  _index === _arr.length - 1
                                                    ? true
                                                    : false
                                                }
                                                cndLinks={cndLinks}
                                                dataKols={dataKols}
                                                isSelected={true}
                                              />
                                            </Tbody>
                                          )
                                        )
                                      : ""}
                                  </Table>
                                </Td>
                              </Tr>
                            </Fragment>
                          );
                        })
                      : ""}
                  </Tbody>
                </Table>
              </Stack>
              <Flex justifyContent="flex-end">
                <TablePagination
                  type="full"
                  page={data?.pagination?.page}
                  pageLength={data?.pagination?.pageSize}
                  totalRecords={data?.pagination?.count}
                  onPageChange={({ page, pageLength }) => {
                    // console.log(page);
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
            </Stack>
          )}
        </CardBody>
      </Card>
    </Flex>
  );
}

export default SelectedMatches;
