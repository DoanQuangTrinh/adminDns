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
  Input,
  InputRightElement,
  InputGroup,
  useToast,
  Box,
} from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import React, { useEffect, useRef, useState } from "react";
import useAxios from "axios-hooks";
import { TablePagination } from "@trendmicro/react-paginations";
import { initialFilter } from "utils/constant";
import CountryCodeTableRow from "components/CountryCode/CountryCodeTableRow";
import { SearchIcon } from "@chakra-ui/icons";
import Loading from "components/Layout/Loading";
import { axiosPost } from "utils/api";
import { ROOT_API } from "utils/constant";
import { API_ROUTES } from "utils/constant";
import LeagueTableRow from "./components/Row";
import CreateMiniLeagueDialog from "./components/CreateMiniLeagueDialog";

function MiniLeague() {
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const [filter, setFilter] = useState(initialFilter);
  const toast = useToast();
  const [searchValue, setSearchValue] = useState("");
  const [loadingImport, setLoadingImport] = useState(false);
  const {
    isOpen: isOpenCreate,
    onOpen: onOpenCreate,
    onClose: onCloseCreate,
  } = useDisclosure();

  const refSearchButton = useRef(null);
  const [{ data, loading, error }, refetch] = useAxios({
    url: ROOT_API + API_ROUTES.MINI_LEAGUE,
    params: filter,
  });
  //   const onImportCountryCode = async () => {
  //     if (
  //       window.confirm("Are you sure to reset and create again the top leagues?")
  //     ) {
  //       setLoadingImport(true);
  //       try {
  //         const data = await axiosPost(ROOT_API + API_ROUTES.CREATE_TOP_LEAGUES);
  //         if (data?.data?.code == 0) {
  //           toast({
  //             title: "Create Top Leagues Successfully",
  //             status: "success",
  //             duration: 9000,
  //             isClosable: true,
  //           });
  //           refetch();
  //         }
  //         setLoadingImport(false);
  //       } catch (error) {
  //         toast({
  //           title:
  //             error?.response?.data?.errors?.errors[0]?.msg ||
  //             error?.response?.data?.msg ||
  //             "Create Top Leagues Fail",
  //           status: "error",
  //           duration: 9000,
  //           isClosable: true,
  //         });
  //         setLoadingImport(false);
  //       }
  //     }
  //   };

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
        <CardHeader p="6px 0px 22px 0px">
          <Text fontSize="xl" color={textColor} fontWeight="bold">
            Mini Leagues Table
          </Text>
        </CardHeader>
        <CardBody pb={4}>
          <Flex mb={3} columnGap={2} justifyContent={"space-between"}>
            {/* <Button
                  colorScheme="red"
                  onClick={onImportCountryCode}
                  disabled={loadingImport}
                >
                  Reset And Create Top League
                </Button> */}
            <Box>
              <Button colorScheme="blue" onClick={onOpenCreate}>
                Create League
              </Button>
            </Box>
          </Flex>
          <Flex columnGap={3} mb={3}>
            <InputGroup>
              <InputRightElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputRightElement>
              <Input
                type="text"
                variant="outline"
                placeholder="Search by name, code"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                onKeyUp={(event) => {
                  if (event.key === "Enter" && event?.target?.value) {
                    const searchBtn = refSearchButton?.current;
                    if (searchBtn !== null) {
                      searchBtn.click();
                    }
                  }
                }}
              />
            </InputGroup>

            <Button
              ref={refSearchButton}
              disabled={!searchValue}
              colorScheme="blue"
              onClick={() => {
                setFilter({
                  ...filter,
                  searchKeyword: searchValue,
                  pageIndex: 0,
                });
              }}
            >
              Search
            </Button>
            <Button
              onClick={() => {
                setSearchValue("");
                setFilter({
                  ...filter,
                  searchKeyword: "",
                  pageIndex: 0,
                });
              }}
            >
              Reset
            </Button>
          </Flex>
          {loading ? (
            <Loading />
          ) : (
            <>
              <Table variant="simple" color={textColor}>
                <Thead>
                  <Tr my=".8rem" pl="0px" color="gray.400">
                    <Th borderColor={borderColor} color="gray.400">
                      League ID
                    </Th>
                    <Th borderColor={borderColor} color="gray.400">
                      Logo
                    </Th>
                    <Th borderColor={borderColor} color="gray.400">
                      Name
                    </Th>
                    <Th borderColor={borderColor} color="gray.400">
                      Active
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
                          <LeagueTableRow
                            row={row}
                            isLast={index === arr.length - 1 ? true : false}
                            key={index}
                            fetchData={refetch}
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
            </>
          )}
        </CardBody>
      </Card>
      {isOpenCreate && (
        <CreateMiniLeagueDialog
          isOpen={isOpenCreate}
          onOpen={onOpenCreate}
          onClose={onCloseCreate}
          fetchData={refetch}
        />
      )}
    </Flex>
  );
}

export default MiniLeague;
