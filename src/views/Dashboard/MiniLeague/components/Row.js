import {
  Avatar,
  Badge,
  Button,
  Checkbox,
  Flex,
  Td,
  Text,
  Tr,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React from "react";

import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useHistory } from "react-router-dom";
import { ROOT_API } from "utils/constant";
import { API_ROUTES } from "utils/constant";
import { axiosPost } from "utils/api";
import CreateMiniLeagueDialog from "./CreateMiniLeagueDialog";

function LeagueTableRow(props) {
  const { row, isLast, fetchData } = props;
  const history = useHistory();
  const textColor = useColorModeValue("gray.500", "white");
  const titleColor = useColorModeValue("gray.700", "white");
  const bgStatus = useColorModeValue("gray.400", "navy.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  function handleRowClick() {
    onOpen();
  }

  const handleActiveLeague = async () => {
    if (window.confirm("Are you sure to active this league?")) {
      const leagueData = {
        leagueId: row.leagueId,
      };
      try {
        const response = await axiosPost(
          ROOT_API + API_ROUTES.UPDATE_LEAGUES,
          leagueData
        );
        if (response?.data?.code === 0) {
          toast({
            title: "Update League Successfully",
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
            "Update League Fail",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }
  };
  const handleDeleteClick = async () => {
    if (window.confirm("Are you sure to delete this league?")) {
      const leagueData = {
        _id: row._id,
      };
      try {
        const response = await axiosPost(
          ROOT_API + API_ROUTES.DELETE_LEAGUES,
          leagueData
        );
        if (response?.data?.code === 0) {
          toast({
            title: "Delete League Successfully",
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
            "Delete League Fail",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }
  };
  return (
    <>
      <Tr>
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Flex direction="column">
            <Text fontSize="md" color={textColor} fontWeight="bold">
              {row?.leagueId}
            </Text>
          </Flex>
        </Td>
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Flex direction="column">
            <Avatar src={process.env.REACT_APP_API_HOST + row.leagueLogo} />
          </Flex>
        </Td>
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Flex
            direction="column"
            onClick={() => {
              history.push(`/admin/mini-leagues/${row?._id}`);
            }}
          >
            <Text
              fontSize="md"
              color="blue.500"
              cursor="pointer"
              fontWeight="bold"
            >
              {row?.name}
            </Text>
          </Flex>
        </Td>
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Flex flexDirection={"row"} alignItems={"center"} columnGap={2}>
            <Checkbox
              id={row?._id}
              value={row?.isActive}
              isChecked={row?.isActive}
              onChange={handleActiveLeague}
            />
            <Text
              fontSize="md"
              color={row?.isActive ? "red" : "green"}
              fontWeight="bold"
            >
              ACTIVE
            </Text>
          </Flex>
        </Td>
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Button
            p="0px"
            bg="transparent"
            variant="no-effects"
            onClick={handleRowClick}
            mr={2}
          >
            <Text
              fontSize="md"
              color="gray.400"
              fontWeight="bold"
              cursor="pointer"
            >
              <EditIcon />
            </Text>
          </Button>
          <Button
            p="0px"
            bg="transparent"
            variant="no-effects"
            onClick={handleDeleteClick}
          >
            <Text
              fontSize="md"
              color="gray.400"
              fontWeight="bold"
              cursor="pointer"
            >
              <DeleteIcon />
            </Text>
          </Button>
        </Td>
      </Tr>
      <CreateMiniLeagueDialog
        leagueDetail={row}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        fetchData={fetchData}
      />
    </>
  );
}

export default LeagueTableRow;
