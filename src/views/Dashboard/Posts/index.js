import React, { useRef, useState } from "react";
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
  Input,
  InputRightElement,
  InputGroup,
  Box,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import { ROOT_API } from "utils/constant";
import { API_ROUTES } from "utils/constant";
import useAxios from "axios-hooks";
import { initialFilter } from "utils/constant";
import { SearchIcon } from "@chakra-ui/icons";
import SeasonTableRow from "./components/Row";
import { TablePagination } from "@trendmicro/react-paginations";
import Loading from "components/Layout/Loading";

const Posts = () => {
  const history = useHistory();
  const refSearchButton = useRef(null);
  const params = useParams();
  const [filter, setFilter] = useState(initialFilter);
  const [searchValue, setSearchValue] = useState("");
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const [{ data, loading, error }, refetch] = useAxios(
    {
      url: `${ROOT_API}${API_ROUTES.POSTS}`,
      params: filter,
    },
    {
      useCache: false,
    }
  );

  return (
    <>
      <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
        <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
          <CardHeader p="6px 0px 22px 0px">
            <Text fontSize="xl" color={textColor} fontWeight="bold">
              Posts
            </Text>
          </CardHeader>
          <CardBody pb={4}>
            <Flex mb={3} columnGap={2} justifyContent={"space-between"}>
              <Box>
                <Button
                  colorScheme="blue"
                  onClick={() => {
                    history.push("/admin/posts/create");
                  }}
                >
                  Create post
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
                  placeholder="Search by title"
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
                        Title
                      </Th>
                      <Th borderColor={borderColor} color="gray.400">
                        Type
                      </Th>
                      <Th borderColor={borderColor} color="gray.400">
                        Public
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
                            <SeasonTableRow
                              row={row}
                              isLast={index === arr.length - 1 ? true : false}
                              key={index}
                              refetchData={refetch}
                              //   handelClickRow={handelClickRow}
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
      </Flex>
    </>
  );
};

export default Posts;
