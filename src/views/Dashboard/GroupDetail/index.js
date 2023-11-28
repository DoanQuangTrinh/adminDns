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
  Tooltip,
} from "@chakra-ui/react";
import { useParams, useHistory } from "react-router-dom";
import useAxios from "axios-hooks";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import { ModalType } from "utils/constant";
import { ROOT_API } from "utils/constant";
import { API_ROUTES } from "utils/constant";
import Row from "./components/Row";
import Loading from "components/Layout/Loading";
import AddTeamDialog from "./components/AddTeamDialog";
import { ArrowBackIcon } from "@chakra-ui/icons";
import UpdateRankDialog from "./components/UpdateRankDialog";

const GroupDetail = () => {
  const params = useParams();
  const history = useHistory();
  const { groupId } = params || {};
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const [teamDetail, setTeamDetail] = useState(null);
  const {
    isOpen: isOpenAddTeamModal,
    onOpen: onOpenAddTeamModal,
    onClose: onCloseAddTeamModal,
  } = useDisclosure();
  const {
    isOpen: isOpenUpdateRankModal,
    onOpen: onOpenUpdateRankModal,
    onClose: onCloseUpdateRankModal,
  } = useDisclosure();

  const openModal = useMemo(
    () => ({
      [ModalType.Add]: onOpenAddTeamModal,
      [ModalType.UpdateRank]: onOpenUpdateRankModal,
    }),
    [onOpenAddTeamModal, onOpenUpdateRankModal]
  );
  const closeModal = useMemo(
    () => ({
      [ModalType.Add]: onCloseAddTeamModal,
      [ModalType.UpdateRank]: onCloseUpdateRankModal,
    }),
    [onCloseAddTeamModal, onCloseUpdateRankModal]
  );
  const [{ data, loading, error }, refetch] = useAxios({
    url: `${ROOT_API}${API_ROUTES.GROUPS}/${groupId}`,
  });

  const handelClickRow = (teamDetail, modalType) => {
    console.log(
      "🚀 ~ file: index.js:67 ~ handelClickRow ~ modalType:",
      modalType
    );
    setTeamDetail(teamDetail);
    openModal?.[modalType]?.();
  };

  const handelCloseModal = (modalType) => {
    setTeamDetail(null);
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
                {`Group: ${data?.data?.name || ""}`}
              </Text>
            </Flex>
          </CardHeader>
          <CardBody pb={4}>
            <Flex mb={3} columnGap={2}>
              <Box>
                <Button colorScheme="blue" onClick={onOpenAddTeamModal}>
                  Add Team
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
                        <Tooltip label="Played">P</Tooltip>
                      </Th>
                      <Th borderColor={borderColor} color="gray.400">
                        <Tooltip label="Wins">W</Tooltip>
                      </Th>
                      <Th borderColor={borderColor} color="gray.400">
                        <Tooltip label="Draws">D</Tooltip>
                      </Th>
                      <Th borderColor={borderColor} color="gray.400">
                        <Tooltip label="Loses">L</Tooltip>
                      </Th>
                      <Th borderColor={borderColor} color="gray.400">
                        <Tooltip label="Goals For">F</Tooltip>
                      </Th>
                      <Th borderColor={borderColor} color="gray.400">
                        <Tooltip label="Goals Against">A</Tooltip>
                      </Th>
                      <Th borderColor={borderColor} color="gray.400">
                        <Tooltip label="Goals Difference">GD</Tooltip>
                      </Th>
                      <Th borderColor={borderColor} color="gray.400">
                        <Tooltip label="Points">PTS</Tooltip>
                      </Th>
                      <Th borderColor={borderColor} color="gray.400">
                        <Tooltip>Status</Tooltip>
                      </Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data?.data?.rankIds?.length
                      ? data?.data?.rankIds?.map((row, index, arr) => {
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
              </>
            )}
          </CardBody>
        </Card>
      </Flex>
      {isOpenAddTeamModal && (
        <AddTeamDialog
          groupDetail={data?.data}
          isOpen={isOpenAddTeamModal}
          onClose={() => {
            onCloseAddTeamModal();
          }}
          refetchData={refetch}
        />
      )}
      {isOpenUpdateRankModal && (
        <UpdateRankDialog
          teamDetail={teamDetail}
          isOpen={isOpenUpdateRankModal}
          onClose={() => {
            onCloseUpdateRankModal();
          }}
          refetchData={refetch}
        />
      )}
    </>
  );
};

export default GroupDetail;
