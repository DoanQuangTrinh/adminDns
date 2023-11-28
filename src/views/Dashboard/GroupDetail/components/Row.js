import {
  Button,
  Flex,
  Td,
  Text,
  Tr,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { ROOT_API } from "utils/constant";
import { API_ROUTES } from "utils/constant";
import { axiosPost } from "utils/api";
import { ModalType } from "utils/constant";
import { Select } from "chakra-react-select";
import { RoundResults } from "utils/constant";

function Row({ row, isLast, refetchData, handelClickRow }) {
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.500", "white");
  const toast = useToast();
  const [status, setStatus] = useState(undefined);

  useEffect(() => {
    setStatus(
      row?.isFail
        ? {
            label: "Eliminated",
            value: "ELIMINATED",
          }
        : {
            label: "Playing",
            value: "PLAYING",
          }
    );
  }, [row?.isFail]);

  const handleDeleteClick = async () => {
    if (window.confirm("Are you sure to delete this season?")) {
      const data = {
        id: row._id,
      };
      try {
        const response = await axiosPost(
          ROOT_API + API_ROUTES.DELETE_GROUP,
          data
        );
        if (response?.data?.code === 0) {
          toast({
            title: "Delete League Successfully",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          refetchData();
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

  const handleChangeStatus = async (optionSelected) => {
    if (window.confirm("Are you want to change status this team?")) {
      const data = {
        rankId: row._id,
      };
      try {
        const response = await axiosPost(
          ROOT_API + API_ROUTES.UPDATE_TEAM_RESULT,
          data
        );
        if (response?.data?.code === 0) {
          toast({
            title: "Change status Successfully",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          setStatus(optionSelected);
        }
      } catch (error) {
        toast({
          title:
            error?.response?.data?.errors?.errors[0]?.msg ||
            error?.response?.data?.msg ||
            "Change status Fail",
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
            <Text fontSize="md" color="blue.500" fontWeight="bold">
              {row?.teamId?.name}
            </Text>
          </Flex>
        </Td>
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Flex direction="column">
            <Text fontSize="sm" color={textColor} fontWeight="bold">
              {row?.plays}
            </Text>
          </Flex>
        </Td>
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Flex direction="column">
            <Text fontSize="sm" color={textColor} fontWeight="bold">
              {row?.wins}
            </Text>
          </Flex>
        </Td>
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Flex direction="column">
            <Text fontSize="sm" color={textColor} fontWeight="bold">
              {row?.draws}
            </Text>
          </Flex>
        </Td>
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Flex direction="column">
            <Text fontSize="sm" color={textColor} fontWeight="bold">
              {row?.loses}
            </Text>
          </Flex>
        </Td>
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Flex direction="column">
            <Text fontSize="sm" color={textColor} fontWeight="bold">
              {row?.goalsFor}
            </Text>
          </Flex>
        </Td>
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Flex direction="column">
            <Text fontSize="sm" color={textColor} fontWeight="bold">
              {row?.goalsAgain}
            </Text>
          </Flex>
        </Td>
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Flex direction="column">
            <Text fontSize="sm" color={textColor} fontWeight="bold">
              {row?.goalsDifference}
            </Text>
          </Flex>
        </Td>
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Flex direction="column">
            <Text fontSize="sm" color={textColor} fontWeight="bold">
              {row?.points}
            </Text>
          </Flex>
        </Td>
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Flex direction="column">
            <Select
              value={status}
              onChange={handleChangeStatus}
              options={RoundResults}
              placeholder={"Choose"}
              chakraStyles={{
                menu: (provided, state) => ({
                  ...provided,
                  zIndex: 10,
                }),
              }}
            />
          </Flex>
        </Td>
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Button
            p="0px"
            bg="transparent"
            variant="no-effects"
            onClick={() => {
              handelClickRow(row, ModalType.UpdateRank);
            }}
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
            <Text fontSize="md" color="red" fontWeight="bold" cursor="pointer">
              <DeleteIcon />
            </Text>
          </Button>
        </Td>
      </Tr>
    </>
  );
}

export default Row;
