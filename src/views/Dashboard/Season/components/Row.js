import {
  Button,
  Flex,
  Td,
  Text,
  Tr,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import React from "react";

import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useHistory } from "react-router-dom";
import { ROOT_API } from "utils/constant";
import { API_ROUTES } from "utils/constant";
import { axiosPost } from "utils/api";
import { ModalType } from "utils/constant";

function Row({ row, isLast, refetchData, handelClickRow }) {
  const history = useHistory();
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const toast = useToast();

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
                history.push(
                  `/admin/season/${row?.seasonId}/group/${row?._id}`
                );
              }}
            >
              {row?.name}
            </Text>
          </Flex>
        </Td>
        <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
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
