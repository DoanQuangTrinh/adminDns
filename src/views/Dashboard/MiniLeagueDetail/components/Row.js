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
import { useHistory } from "react-router-dom";
import { Select } from "chakra-react-select";
import {
  ROOT_API,
  API_ROUTES,
  ModalType,
  SeasonStatusOption,
} from "utils/constant";
import { axiosPost } from "utils/api";

function SeasonTableRow({ row, isLast, refetchData, handelClickRow }) {
  const history = useHistory();
  const textColor = useColorModeValue("gray.500", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const toast = useToast();
  const [status, setStatus] = useState(undefined);

  useEffect(() => {
    if (row?.status) {
      setStatus(SeasonStatusOption.find((item) => item.value === row?.status));
      return;
    }

    return setStatus(SeasonStatusOption[0]);
  }, [row?.status]);

  const handleDeleteClick = async () => {
    if (window.confirm("Are you sure to delete this season?")) {
      const data = {
        id: row._id,
      };
      try {
        const response = await axiosPost(
          ROOT_API + API_ROUTES.DELETE_SEASON,
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
    if (window.confirm("Are you want to change status this season?")) {
      const data = {
        id: row._id,
        status: optionSelected?.value,
      };
      try {
        const response = await axiosPost(
          ROOT_API + API_ROUTES.UPDATE_STATUS_SEASON,
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
            <Text
              fontSize="md"
              color="blue.500"
              cursor="pointer"
              fontWeight="bold"
              onClick={() => {
                history.push(`/admin/season/${row?._id}`);
              }}
            >
              {row?.name}
            </Text>
          </Flex>
        </Td>
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Flex direction="column">
            <Text fontSize="md" color={textColor} fontWeight="bold">
              {row?.numberTeam}
            </Text>
          </Flex>
        </Td>
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Flex direction="column">
            <Text fontSize="md" color={textColor} fontWeight="bold">
              {row?.numberGroup}
            </Text>
          </Flex>
        </Td>
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Flex direction="column">
            <Text fontSize="md" color={textColor} fontWeight="bold">
              {row?.type}
            </Text>
          </Flex>
        </Td>
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          <Flex direction="column">
            <Select
              value={status}
              onChange={handleChangeStatus}
              options={SeasonStatusOption}
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
          {row?.status === "UP_COMING" && (
            <Button
              p="0px"
              bg="transparent"
              variant="no-effects"
              onClick={() => {
                handelClickRow(row, ModalType.Add);
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
          )}
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

export default SeasonTableRow;
