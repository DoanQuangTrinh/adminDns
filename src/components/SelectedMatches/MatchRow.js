import {
  Avatar,
  Badge,
  Button,
  Flex,
  Td,
  Box,
  Text,
  IconButton,
  Tr,
  useColorModeValue,
  useDisclosure,
  Checkbox,
  useToast,
  Icon,
  Select,
} from "@chakra-ui/react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import SelectedMatchDialog from "./SelectedMatchDialog";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  DeleteIcon,
  EditIcon,
  LockIcon,
  UnlockIcon,
} from "@chakra-ui/icons";
import { BiFootball } from "react-icons/bi";
import ExpandedRow from "./ExpandedRow";
// import AddKolDialog from "./AddKolDialog";
import { axiosGet } from "utils/api";
import SetHotMatchDialog from "./SetHotMatchDialog";
import ChooseCdnLinkDialog from "./ChooseCdnLinkDialog";
import { axiosPost } from "utils/api";
import { ROOT_API } from "utils/constant";
import { API_ROUTES } from "utils/constant";
import CreateMatchDialog from "views/Dashboard/Match/components/CreateMatchDialog";
import UpdateScoreDialog from "./UpdateScoreDialog";
import { MATCH_STATUS } from "utils/constant";
const matchApi =
  process.env.REACT_APP_API_HOST + process.env.REACT_APP_MATCH_INFO;
function MatchRow(props) {
  const {
    data,
    isLast,
    fetchData,
    dataKols = null,
    isSelected = false,
    cndLinks = null,
  } = props;
  const textColor = useColorModeValue("gray.600", "white");
  const titleColor = useColorModeValue("gray.700", "white");
  const bgStatus = useColorModeValue("gray.400", "navy.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const [status, setStatus] = useState();
  useEffect(() => {
    if (data?.shortStatus) {
      setStatus(data.shortStatus);
    }
  }, [data]);
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenCreate,
    onOpen: onOpenCreate,
    onClose: onCloseCreate,
  } = useDisclosure();
  const {
    isOpen: isOpenAddCdn,
    onOpen: onOpenAddCdn,
    onClose: onCloseAddCdn,
  } = useDisclosure();
  const {
    isOpen: isOpenSetHotMatch,
    onOpen: onOpenSetHotMatch,
    onClose: onCloseSetHotMatch,
  } = useDisclosure();
  const {
    isOpen: isOpenUpdateScore,
    onOpen: onOpenUpdateScore,
    onClose: onCloseUpdateScore,
  } = useDisclosure();

  const toast = useToast();
  const [expandedRows, setExpandedRows] = useState([]);
  // function handleRowClick() {
  //   onOpen();
  // }

  function handleSetHotMatch() {
    onOpenSetHotMatch();
  }

  function handleChooseCdn() {
    onOpenAddCdn();
  }

  const handleOpenClick = async () => {
    let msg = "Are you to open access the live match?";
    if (data.isCommentedBeforeGame) {
      msg = "Are you to close access the live match?";
    }
    if (window.confirm(msg)) {
      const matchData = {
        matchId: data.matchId,
      };
      try {
        const response = await axiosPost(
          ROOT_API + API_ROUTES.OPEN_LINK_LIVE,
          matchData
        );
        if (response?.data?.code == 0) {
          toast({
            title: data.isCommentedBeforeGame
              ? "Close Live Match Successfully"
              : "Open Live Match Successfully",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          fetchData();
        }
      } catch (error) {
        toast({
          title:
            error?.response?.data?.errors?.errors[0]?.msg ||
            error?.response?.data?.msg ||
            "Update Live Match Fail",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }
  };
  const handleDeleteClick = async () => {
    if (window.confirm("Are you to remove the live match?")) {
      const matchData = {
        matchId: data.matchId,
      };
      try {
        const response = await axiosPost(
          ROOT_API + API_ROUTES.REMOVE_LINK_LIVE,
          matchData
        );
        if (response?.data?.code == 0) {
          toast({
            title: "Delete Live Match Successfully",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          fetchData();
        }
      } catch (error) {
        toast({
          title:
            error?.response?.data?.errors?.errors[0]?.msg ||
            error?.response?.data?.msg ||
            "Delete Live Match Fail",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }
  };
  const handleDeleteMatchClick = async () => {
    if (window.confirm("Are you to remove the match?")) {
      const matchData = {
        id: data._id,
      };
      try {
        const response = await axiosPost(
          ROOT_API + API_ROUTES.DELETE_MATCH,
          matchData
        );
        if (response?.data?.code == 0) {
          toast({
            title: "Delete Match Successfully",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          fetchData();
        }
      } catch (error) {
        toast({
          title:
            error?.response?.data?.errors?.errors[0]?.msg ||
            error?.response?.data?.msg ||
            "Delete Match Fail",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }
  };
  const handleChangeStatus = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    if (
      window.confirm(
        `Are you sure to change status to "${MATCH_STATUS[newStatus]}" ?`
      )
    ) {
      const matchData = {
        matchId: data.matchId,
        status: newStatus,
      };
      try {
        const response = await axiosPost(
          ROOT_API + API_ROUTES.UPDATE_STATUS_MATCH,
          matchData
        );
        if (response?.data?.code == 0) {
          toast({
            title: "Update Status Match Successfully",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          fetchData();
        }
      } catch (error) {
        toast({
          title:
            error?.response?.data?.errors?.errors[0]?.msg ||
            error?.response?.data?.msg ||
            "Update Status Match Fail",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }
  };
  const toggleRow = (id) => {
    if (expandedRows.includes(id)) {
      setExpandedRows(expandedRows.filter((rowId) => rowId !== id));
    } else {
      setExpandedRows([...expandedRows, id]);
    }
  };
  return (
    <>
      {/* <Flex maxW="full"> */}
      <Tr>
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Text fontSize="md" color={textColor} fontWeight="bold">
            {data?.matchId}
          </Text>
        </Td>
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Text fontSize="md" color={textColor}>
            {data?.home_name} / {data?.away_name}
          </Text>
        </Td>

        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Text fontSize="md" color={textColor}>
            {moment
              .utc(data?.time || data?.date)
              .local()
              .format("HH:mm")}
          </Text>
        </Td>
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null} minWidth={220}>
          <Select onChange={handleChangeStatus} value={status}>
            {Object.keys(MATCH_STATUS).map((key) => (
              <option key={key} value={key}>
                {MATCH_STATUS[key]}
              </option>
            ))}
          </Select>
        </Td>
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Text fontSize="md" color={textColor}>
            {data?.homeGoals || 0} - {data?.awayGoals || 0}
          </Text>
        </Td>
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Flex flexDirection={"row"} alignItems={"center"} columnGap={2}>
            <Checkbox
              id={data?._id}
              value={data?.isLive}
              isChecked={data?.isLive}
              onChange={handleChooseCdn}
              disabled={data?.shortStatus === "FT"}
            />
            <Text
              fontSize="md"
              color={isSelected || data?.isLive ? "red" : "green"}
              fontWeight="bold"
            >
              {isSelected || data?.isLive ? "LIVE" : "LIVE"}
            </Text>
          </Flex>
        </Td>
        {!isSelected && data.isMini && (
          <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
            <>
              {/* <Button
                p="0px"
                bg="transparent"
                variant="no-effects"
                onClick={onOpenCreate}
                mr={2}
              >
                <Text fontSize="md" fontWeight="bold" cursor="pointer">
                  <EditIcon />
                </Text>
              </Button> */}
              <Button
                p="0px"
                bg="transparent"
                variant="no-effects"
                onClick={handleDeleteMatchClick}
                disabled={data?.shortStatus !== "NS"}
              >
                <Text fontSize="md" fontWeight="bold" cursor="pointer">
                  <DeleteIcon />
                </Text>
              </Button>
            </>
          </Td>
        )}

        {isSelected ? (
          <>
            <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
              <Flex flexDirection={"row"} alignItems={"center"} columnGap={2}>
                <Checkbox
                  id={data?._id}
                  value={data?.isHot}
                  isChecked={data?.isHot}
                  onChange={handleSetHotMatch}
                  disabled={data?.shortStatus === "FT"}
                />
                <Text
                  fontSize="md"
                  color={data?.isHot ? "red" : "green"}
                  fontWeight="bold"
                >
                  Feature
                </Text>
              </Flex>
            </Td>
            <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
              <Flex direction={"row"} columnGap={1}>
                <Box as="tr">
                  <IconButton
                    icon={
                      expandedRows?.includes(data?.fixture?.id) ? (
                        <ChevronDownIcon />
                      ) : (
                        <ChevronUpIcon />
                      )
                    }
                    onClick={() => toggleRow(data?.fixture?.id)}
                    aria-label={
                      expandedRows?.includes(data?.fixture?.id)
                        ? "Hide details"
                        : "Show details"
                    }
                  />
                </Box>
              </Flex>
            </Td>
            <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
              <Flex direction={"row"} columnGap={1}>
                {data?.isMini && data?.shortStatus !== "NS" ? (
                  <Button px="2" bg="transparent" onClick={onOpenUpdateScore}>
                    <Icon as={BiFootball} cursor="pointer" />
                  </Button>
                ) : (
                  ""
                )}
                <Button
                  px="2"
                  bg="transparent"
                  onClick={handleOpenClick}
                  disabled={data?.shortStatus !== "NS"}
                >
                  {!data?.isCommentedBeforeGame ? <UnlockIcon /> : <LockIcon />}
                </Button>
                <Button
                  px="2"
                  bg="transparent"
                  onClick={handleDeleteClick}
                  disabled={data?.shortStatus !== "NS"}
                >
                  <DeleteIcon />
                </Button>
              </Flex>
            </Td>
          </>
        ) : (
          ""
        )}
      </Tr>
      {/* <SelectedMatchDialog
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        fetchData={fetchData}
        idMatch={data?.fixture?.id}
        time={data?.fixture?.date}
      /> */}
      {isOpenAddCdn && (
        <ChooseCdnLinkDialog
          isOpen={isOpenAddCdn}
          onOpen={onOpenAddCdn}
          onClose={onCloseAddCdn}
          fetchData={fetchData}
          dataCurrentMatch={data}
          cndLinks={cndLinks}
        />
      )}
      {isSelected && (
        <>
          <SetHotMatchDialog
            isOpen={isOpenSetHotMatch}
            onOpen={onOpenSetHotMatch}
            onClose={onCloseSetHotMatch}
            fetchData={fetchData}
            dataCurrentMatch={data}
          />
        </>
      )}
      {expandedRows.includes(data?.fixture?.id) && (
        <Tr>
          <Td colSpan={8}>
            <ExpandedRow data={data} refetch={fetchData} dataKols={dataKols} />
          </Td>
        </Tr>
      )}
      {isOpenCreate && (
        <CreateMatchDialog
          matchDetail={data}
          isOpen={isOpenCreate}
          onOpen={onOpenCreate}
          onClose={onCloseCreate}
          fetchData={fetchData}
        />
      )}
      {isOpenUpdateScore && (
        <UpdateScoreDialog
          matchDetail={data}
          isOpen={isOpenUpdateScore}
          onOpen={onOpenUpdateScore}
          onClose={onCloseUpdateScore}
          fetchData={fetchData}
        />
      )}
    </>
  );
}

export default MatchRow;
