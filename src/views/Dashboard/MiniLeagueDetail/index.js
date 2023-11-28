import React, { useMemo, useRef, useState } from "react";
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
import { useParams, useHistory } from "react-router-dom";
import useAxios from "axios-hooks";
import { ArrowBackIcon, SearchIcon } from "@chakra-ui/icons";
import { TablePagination } from "@trendmicro/react-paginations";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import { ModalType } from "utils/constant";
import CreateSeasonDialog from "./components/CreateSeasonDialog";
import { ROOT_API } from "utils/constant";
import { API_ROUTES } from "utils/constant";
import { initialFilter } from "utils/constant";
import SeasonTableRow from "./components/Row";
import Loading from "components/Layout/Loading";

const MiniLeagueDetail = () => {
  const refSearchButton = useRef(null);
  const params = useParams();
  const history = useHistory();
  const { id } = params || {};
  const [filter, setFilter] = useState(initialFilter);
  const [searchValue, setSearchValue] = useState("");
  const [seasonDetail, setSeasonDetail] = useState(null);
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const {
    isOpen: isOpenAddModal,
    onOpen: onOpenAddModal,
    onClose: onCloseAddModal,
  } = useDisclosure();
  const {
    isOpen: isOpenDeleteModal,
    onOpen: onOpenDeleteModal,
    onClose: onCloseDeleteModal,
  } = useDisclosure();
  const {
    isOpen: isOpenImportModal,
    onOpen: onOpenImportModal,
    onClose: onCloseImportModal,
  } = useDisclosure();
  const openModal = useMemo(
    () => ({
      [ModalType.Add]: onOpenAddModal,
      [ModalType.Delete]: onOpenDeleteModal,
      [ModalType.Import]: onOpenImportModal,
    }),
    [onOpenAddModal, onOpenDeleteModal, onOpenImportModal]
  );
  const closeModal = useMemo(
    () => ({
      [ModalType.Add]: onCloseAddModal,
      [ModalType.Delete]: onCloseDeleteModal,
      [ModalType.Import]: onCloseImportModal,
    }),
    [onCloseAddModal, onCloseDeleteModal, onCloseImportModal]
  );
  const [{ data, loading, error }, refetch] = useAxios({
    url: `${ROOT_API}${API_ROUTES.SEASON_OF_LEAGUE}/${id}`,
    params: filter,
  });

  const handelClickRow = (seasonDetail, modalType) => {
    setSeasonDetail(seasonDetail);
    openModal?.[modalType]?.();
  };

  const handelCloseModal = (modalType) => {
    setSeasonDetail(null);
    closeModal?.[modalType]?.();
  };

  return (
    <>
      <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
        <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
          <CardHeader p="6px 0px 22px 0px">
            <Flex alignItems="center">
              <ArrowBackIcon
                cursor="pointer"
                boxSize={6}
                onClick={() => {
                  history.goBack();
                }}
              />
              <Text ml={2} fontSize="xl" color={textColor} fontWeight="bold">
                Season
              </Text>
            </Flex>
          </CardHeader>
          <CardBody pb={4}>
            <Flex mb={3} columnGap={2} justifyContent={"space-between"}>
              <Box>
                <Button colorScheme="blue" onClick={onOpenAddModal}>
                  Create season
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
                        Name
                      </Th>
                      <Th borderColor={borderColor} color="gray.400">
                        Team number
                      </Th>
                      <Th borderColor={borderColor} color="gray.400">
                        Group number
                      </Th>
                      <Th borderColor={borderColor} color="gray.400">
                        Type
                      </Th>
                      <Th borderColor={borderColor} color="gray.400">
                        Status
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
                              handelClickRow={handelClickRow}
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
      {isOpenAddModal && (
        <CreateSeasonDialog
          seasonDetail={seasonDetail}
          isOpen={isOpenAddModal}
          onClose={handelCloseModal}
          refetchData={refetch}
        />
      )}
    </>
  );
};

export default MiniLeagueDetail;
