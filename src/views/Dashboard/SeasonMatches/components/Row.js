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
import { DeleteIcon } from "@chakra-ui/icons";
import { ROOT_API } from "utils/constant";
import { API_ROUTES } from "utils/constant";
import { axiosPost } from "utils/api";

function Row({ row, isLast, refetchData, handelClickRow }) {
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.500", "white");
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
