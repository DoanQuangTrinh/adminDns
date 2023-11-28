import {
    Avatar,
    Badge,
    Button,
    Flex,
    Td,
    Text,
    Tr,
    useColorModeValue,
    useDisclosure,
    useToast,
  } from "@chakra-ui/react";
  import React from "react";
  import { axiosPost } from "utils/api";
import GroupRegisterDialog from "./GroupRegisterDialog";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
  const deleteGroupApi =
    process.env.REACT_APP_API_HOST + process.env.REACT_APP_DELETE_GROUPS;
  
  function GroupRow(props) {
    const { id, isLast, fetchData, data } = props;
    const textColor = useColorModeValue("gray.500", "white");
    const titleColor = useColorModeValue("gray.700", "white");
    const bgStatus = useColorModeValue("gray.400", "navy.900");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const toast = useToast();
    const {
      isOpen: isRegisterOpen,
      onOpen: onRegisterOpen,
      onClose: onRegisterClose,
    } = useDisclosure();
  
    function handleRowClick() {
      onRegisterOpen();
    }
  
    async function handleDeleteClick() {
      if (window.confirm("Are you sure to delete the group?")) {
        const kolData = {
          id,
        };
        try {
          const response = await axiosPost(deleteGroupApi, kolData);
          if (response?.data?.code == 0) {
            toast({
              title: "Delete Group Successfully",
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
              "Delete Group Fail",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        }
      }
    }
  
    return (
      <>
        <Tr>
          <Td
            width="100px"
            pl="0px"
            borderColor={borderColor}
            borderBottom={isLast ? "none" : null}
          >
            <Flex direction="column">
              <Text fontSize="md" color={textColor} fontWeight="bold">
                {data?.groupName}
              </Text>
            </Flex>
          </Td>
          <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
            <Flex direction="column">
              <Text fontSize="md" color={textColor} fontWeight="bold">
                {data?.isTrue ? "Active" : "Inactive"}
              </Text>
            </Flex>
          </Td>
          <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
            <Button px="2" bg="transparent" onClick={handleRowClick}>
              <EditIcon />
            </Button>
            <Button px="2" bg="transparent" onClick={handleDeleteClick}>
              <DeleteIcon />
            </Button>
          </Td>
        </Tr>
        <GroupRegisterDialog
          isOpen={isRegisterOpen}
          onOpen={onRegisterOpen}
          onClose={onRegisterClose}
          fetchData={fetchData}
          data={data}
        />
      </>
    );
  }
  
  export default GroupRow;
  