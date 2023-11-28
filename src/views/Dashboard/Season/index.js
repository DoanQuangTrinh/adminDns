import React, { useMemo, useState } from "react";
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
  Box,
} from "@chakra-ui/react";
import { useParams, useHistory } from "react-router-dom";
import useAxios from "axios-hooks";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { TablePagination } from "@trendmicro/react-paginations";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import { ModalType } from "utils/constant";
import { ROOT_API } from "utils/constant";
import { API_ROUTES } from "utils/constant";
import { initialFilter } from "utils/constant";
import CreateGroupDialog from "./components/CreateGroupDialog";
import Row from "./components/Row";
import Loading from "components/Layout/Loading";
import AddTeamDialog from "./components/AddTeamDialog";

const Season = () => {
  const history = useHistory();
  const params = useParams();
  const { id } = params || {};
  const [filter, setFilter] = useState(initialFilter);
  const [groupDetail, setGroupDetail] = useState(null);
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const {
    isOpen: isOpenAddModal,
    onOpen: onOpenAddModal,
    onClose: onCloseAddModal,
  } = useDisclosure();
  const {
    isOpen: isOpenAddTeamModal,
    onOpen: onOpenAddTeamModal,
    onClose: onCloseAddTeamModal,
  } = useDisclosure();
  const openModal = useMemo(
    () => ({
      [ModalType.Add]: onOpenAddModal,
      [ModalType.Delete]: onOpenAddTeamModal,
    }),
    [onOpenAddModal, onOpenAddTeamModal]
  );
  const closeModal = useMemo(
    () => ({
      [ModalType.Add]: onCloseAddModal,
      [ModalType.Delete]: onCloseAddTeamModal,
    }),
    [onCloseAddModal, onCloseAddTeamModal]
  );
  const [{ data: seasonDetail }] = useAxios({
    url: `${ROOT_API}${API_ROUTES.SEASONS}/${id}`,
    params: filter,
  });
  const [{ data, loading, error }, refetch] = useAxios({
    url: `${ROOT_API}${API_ROUTES.GROUP_OF_SEASON}/${id}`,
    params: filter,
  });
  const handelClickRow = (groupDetail, modalType) => {
    setGroupDetail(groupDetail);
    openModal?.[modalType]?.();
  };

  const handelCloseModal = (modalType) => {
    setGroupDetail(null);
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
                {`Season: ${seasonDetail?.data?.name || ""} - Type: ${
                  seasonDetail?.data?.type || ""
                } - Teams: ${seasonDetail?.data?.numberTeam || ""}`}
              </Text>
            </Flex>
          </CardHeader>
          <CardBody pb={4}>
            <Flex mb={3} columnGap={2}>
              {/* <Box>
                <Button colorScheme="blue" onClick={onOpenAddModal}>
                  Create Group
                </Button>
              </Box> */}
              <Box>
                <Button colorScheme="blue" onClick={onOpenAddTeamModal}>
                  Add Team
                </Button>
              </Box>
              <Box>
                <Button
                  colorScheme="blue"
                  onClick={() => {
                    history.push(`/admin/season/${id}/matches`);
                  }}
                >
                  Matches
                </Button>
              </Box>
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
                        Action
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data?.data?.length
                      ? data?.data?.map((row, index, arr) => {
                          return (
                            <Row
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
        <CreateGroupDialog
          groupDetail={groupDetail}
          isOpen={isOpenAddModal}
          onClose={handelCloseModal}
          refetchData={refetch}
        />
      )}
      {isOpenAddTeamModal && (
        <AddTeamDialog
          groupDetail={groupDetail}
          seasonDetail={seasonDetail?.data}
          isOpen={isOpenAddTeamModal}
          onClose={() => {
            onCloseAddTeamModal();
          }}
          refetchData={refetch}
        />
      )}
    </>
  );
};

export default Season;
