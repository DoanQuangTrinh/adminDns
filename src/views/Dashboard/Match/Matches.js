// Chakra imports
import {
  Box,
  Button,
  Flex,
  Stack,
  Table,
  Tbody,
  Td,
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
import React, { useState, useMemo, useEffect, Fragment } from "react";
import Loading from "components/Layout/Loading";
import { TablePagination } from "@trendmicro/react-paginations";
import "@trendmicro/react-paginations/dist/react-paginations.css";
import FilterMatch from "../FilterMatch/FilterMatch";
import MatchRow from "components/SelectedMatches/MatchRow";
import { ROOT_API } from "utils/constant";
import { API_ROUTES } from "utils/constant";
import { initialFilter } from "utils/constant";
import WeekFilter from "../WeekFilter/WeekFilter";
import { today } from "utils/helpers";
import LeagueFilter from "components/LeagueFilter/LeagueFilter";
import CreateMatchDialog from "./components/CreateMatchDialog";

// const matchApi =
//   process.env.REACT_APP_API_HOST + process.env.REACT_APP_MATCH_ALL_MATCHES;
const cdnLinkApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_CDN_LINKS;
function Matches() {
  const bgColor = useColorModeValue("blue.200", "white");
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", { textColor });
  const [filter, setFilter] = useState({
    ...initialFilter,
    date: today,
  });
  const {
    isOpen: isOpenCreate,
    onOpen: onOpenCreate,
    onClose: onCloseCreate,
  } = useDisclosure();
  const [{ data, loading, error }, refetch] = useAxios(
    {
      url: ROOT_API + API_ROUTES.CALENDAR_MATCHES,
      params: filter,
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

  // const dataTable = useMemo(() => {
  //   const firstPageIndex = (currentPage - 1) * pageSize;
  //   const lastPageIndex = firstPageIndex + pageSize;
  //   return data?.matches?.slice(firstPageIndex, lastPageIndex);
  // }, [data?.matches, currentPage, pageSize]);

  const onFilterMatch = (dataFilter) => {
    setFilter({
      ...filter,
      pageIndex: 0,
      date: dataFilter,
    });
    // refetch()
  };

  const onFilterLeague = (dataFilter) => {
    setFilter({
      ...filter,
      pageIndex: 0,
      league_id: dataFilter,
    });
    // refetch()
  };
  return (
    <>
      <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
        <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
          <CardHeader p="6px 0px 22px 0px">
            <Text fontSize="xl" color={textColor} fontWeight="bold">
              Matches
            </Text>
          </CardHeader>
          <CardBody>
            {/* <Box pb={6}>
              <Button colorScheme="blue" onClick={onOpenCreate}>
                Create Match
              </Button>
            </Box> */}
            {/* <FilterMatch onFilterMatch={onFilterMatch} filterProps={filter} /> */}
            <WeekFilter onFilterMatch={onFilterMatch} filterProps={filter} />
            <LeagueFilter
              onFilterLeague={onFilterLeague}
              filterProps={filter}
            />
            {loading ? (
              <Box py="30px">
                <Loading />
              </Box>
            ) : (
              <>
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
                    page={filter.pageIndex + 1}
                    pageLength={filter.pageSize}
                    totalRecords={data?.pagination?.count}
                    onPageChange={({ page, pageLength }) => {
                      setFilter({
                        ...filter,
                        pageIndex: page - 1,
                        pageSize: pageLength,
                      });
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
      {isOpenCreate && (
        <CreateMatchDialog
          isOpen={isOpenCreate}
          onOpen={onOpenCreate}
          onClose={onCloseCreate}
          fetchData={refetch}
        />
      )}
    </>
  );
}

export default Matches;
