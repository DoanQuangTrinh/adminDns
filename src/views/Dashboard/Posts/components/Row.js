import {
  Button,
  Flex,
  Switch,
  Td,
  Text,
  Tr,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";

import { DeleteIcon } from "@chakra-ui/icons";
import { useHistory } from "react-router-dom";
import { ROOT_API } from "utils/constant";
import { API_ROUTES } from "utils/constant";
import { axiosPost } from "utils/api";

function SeasonTableRow({ row, isLast, refetchData }) {
  const [isPublic, setIsPublic] = useState(row?.isShow);
  const history = useHistory();
  const textColor = useColorModeValue("gray.500", "white");
  const titleColor = useColorModeValue("gray.700", "white");
  const bgStatus = useColorModeValue("gray.400", "navy.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const toast = useToast();

  const handleSuccess = (message, isRefetch) => {
    toast({
      title: message,
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    isRefetch && refetchData();
  };

  const handleError = (message) => {
    toast({
      title: message,
      status: "error",
      duration: 9000,
      isClosable: true,
    });
  };

  const handleDeleteClick = async () => {
    if (window.confirm("Are you sure to delete this post?")) {
      const data = {
        id: row._id,
      };
      try {
        const response = await axiosPost(
          ROOT_API + API_ROUTES.DELETE_POST,
          data
        );
        if (response?.data?.code === 0) {
          handleSuccess("Delete Post Successfully", true);
        }
      } catch (error) {
        handleError(
          error?.response?.data?.errors?.errors[0]?.msg ||
            error?.response?.data?.msg ||
            "Delete Post Fail"
        );
      }
    }
  };

  const handlePublicPost = async (status) => {
    try {
      const response = await axiosPost(
        `${ROOT_API}${API_ROUTES.PUBLIC_POST}/${row?._id}`,
        undefined
      );
      if (response?.data?.code === 0) {
        handleSuccess("Public Post Successfully");
        setIsPublic(status);
      }
    } catch (error) {
      handleError(
        error?.response?.data?.errors?.errors[0]?.msg ||
          error?.response?.data?.msg ||
          "Public Post Fail"
      );
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
                history.push(`/admin/posts/detail/${row?._id}`);
              }}
            >
              {row?.title}
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
            <Switch
              size="md"
              isChecked={isPublic}
              onChange={(e) => handlePublicPost(e.target.checked)}
            />
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

export default SeasonTableRow;
