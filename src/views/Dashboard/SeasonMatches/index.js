import React, { Fragment, useMemo, useRef, useState } from "react";
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
  Stack,
  Td,
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
import CreateMiniMatch from "./components/CreateMiniMatch";
import MatchRow from "./components/MatchRow";
import { ArrowBackIcon } from "@chakra-ui/icons";

const cdnLinkApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_CDN_LINKS;

const SeasonMatches = () => {
  const params = useParams();
  const history = useHistory();
  const { id } = params || {};
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgColor = useColorModeValue("#F8F9FA", "navy.900");

  const {
    isOpen: isOpenAddMatchModal,
    onOpen: onOpenAddMatchModal,
    onClose: onCloseAddMatchModal,
  } = useDisclosure();

  const [{ data, loading, error }, refetch] = useAxios({
    url: `${ROOT_API}${API_ROUTES.MATCHES_ROUND_SEASON}?seasonId=${id}&pageSize=100&pageIndex=0`,
  });

  const [{ data: cndLinks }] = useAxios(
    {
      url: cdnLinkApi,
    },
    {
      useCache: false,
    }
  );

  const handelCloseModal = (modalType) => {
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
                <Button colorScheme="blue" onClick={onOpenAddMatchModal}>
                  Create Match
                </Button>
              </Box>
            </Flex>
            {loading ? (
              <Loading />
            ) : (
              <>
                <Stack overflow={"auto"}>
                  <Table variant="simple" color={textColor}>
                    <Thead bg={bgColor} hidden>
                      <Tr my=".8rem" pl="0px" color={textColor}>
                        <Th borderColor={borderColor} color={textColor}>
                          Round
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.data?.length
                        ? data.data.map((row, index, arr) => {
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
                                      {row.round}
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
                                            Group Name
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
                                                  onCloseAddMatchModal={
                                                    onCloseAddMatchModal
                                                  }
                                                  roundId={row._id}
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
              </>
            )}
          </CardBody>
        </Card>
      </Flex>
      {isOpenAddMatchModal && (
        <CreateMiniMatch
          groupDetail={data?.data}
          isOpen={isOpenAddMatchModal}
          onClose={() => {
            onCloseAddMatchModal();
          }}
          refetchData={refetch}
        />
      )}
    </>
  );
};

export default SeasonMatches;
