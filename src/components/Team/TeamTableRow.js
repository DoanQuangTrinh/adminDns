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

import { axiosPost } from "../../utils/api";

import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { ROOT_API } from "utils/constant";
import { API_ROUTES } from "utils/constant";
import EditTeamDialog from "./EditTeamDialog";
import CreateLeagueDialog from "./CreateTeamDialog";

function TeamTableRow(props) {
  const { row, isLast, fetchData } = props;
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
    if (window.confirm("Are you sure to delete this team?")) {
      const teamData = {
        id: row._id,
      };
      try {
        const response = await axiosPost(
          ROOT_API + API_ROUTES.DELETE_TEAM,
          teamData
        );
        if (response?.data?.code === 0) {
          toast({
            title: "Delete team Successfully",
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
            "Delete team Fail",
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
            <Avatar src={ROOT_API + row.logoUrl} />
          </Flex>
        </Td>
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Flex direction="column">
            <Text fontSize="md" color={textColor} fontWeight="bold">
              {row?.name}
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
      <EditTeamDialog
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        fetchData={fetchData}
        teamData={row}
        teamId={row?._id}
      />
    </>
  );
}

export default TeamTableRow;
