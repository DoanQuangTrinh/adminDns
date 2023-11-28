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
} from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import React, { useEffect, useRef, useState } from "react";
import useAxios from "axios-hooks";
import { TablePagination } from "@trendmicro/react-paginations";
import { initialFilter } from "utils/constant";
import { SearchIcon } from "@chakra-ui/icons";
import Loading from "components/Layout/Loading";
import { axiosPost } from "utils/api";
import { ROOT_API } from "utils/constant";
import { API_ROUTES } from "utils/constant";
import TeamTableRow from "components/Team/TeamTableRow";
import CreateTeamDialog from "components/Team/CreateTeamDialog";

function Team() {
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const [filter, setFilter] = useState(initialFilter);
  const toast = useToast();
  const [searchValue, setSearchValue] = useState("");
  // const [loadingImport, setLoadingImport] = useState(false);
    const {
      isOpen: isOpenCreate,
      onOpen: onOpenCreate,
      onClose: onCloseCreate,
    } = useDisclosure();

  const refSearchButton = useRef(null);
  const [{ data, loading, error }, refetch] = useAxios({
    url: ROOT_API + API_ROUTES.TEAMS,
    params: filter,
  });

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
        <CardHeader p="6px 0px 22px 0px">
          <Text fontSize="xl" color={textColor} fontWeight="bold">
            Teams Table
          </Text>
        </CardHeader>
        <CardBody pb={4}>
          {loading ? (
            <Loading />
          ) : (
            <>
              <Flex mb={3} columnGap={2} justifyContent={"space-between"}>
                <Button colorScheme="blue" onClick={onOpenCreate}>
                  Create Team
                </Button>
              </Flex>
              <Flex columnGap={3} mb={3}>
                <InputGroup>
                  <InputRightElement pointerEvents="none">
                    <SearchIcon color="gray.300" />
                  </InputRightElement>
                  <Input
                    type="text"
                    variant="outline"
                    placeholder="Search by name"
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
              <Table variant="simple" color={textColor}>
                <Thead>
                  <Tr my=".8rem" pl="0px" color="gray.400">
                    <Th borderColor={borderColor} color="gray.400">
                      Logo
                    </Th>
                    <Th borderColor={borderColor} color="gray.400">
                      Name
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
                          <TeamTableRow
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
      <CreateTeamDialog
        isOpen={isOpenCreate}
        onOpen={onOpenCreate}
        onClose={onCloseCreate}
        fetchData={refetch}
      />
    </Flex>
  );
}

export default Team;
